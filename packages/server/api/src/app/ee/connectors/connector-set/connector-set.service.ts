import { ActivepiecesError, apId, ErrorCode, isNil, kebabCase, SeekPage, spreadIfDefined, tryCatch } from '@wippa/core-utils'
import { CreatePieceSetRequestBody, ConnectorSet, PieceSetConfig, UpdatePieceSetRequestBody } from '@wippa/shared'
import { FastifyBaseLogger } from 'fastify'
import { EntityManager, In, QueryFailedError } from 'typeorm'
import { repoFactory } from '../../../core/db/repo-factory'
import { transaction } from '../../../core/db/transaction'
import { distributedLock } from '../../../database/redis-connections'
import { connectorSetConfig } from './connector-set-config'
import { ConnectorSetEntity } from './connector-set.entity'

export const connectorSetRepo = repoFactory<ConnectorSet>(ConnectorSetEntity)

const MAX_PIECE_SET_PAGE_SIZE = 100

type ListParams = {
    platformId: string
    cursor?: string
    limit?: number
}

type GetOneParams = {
    id: string
    platformId: string
}

type CreateParams = CreatePieceSetRequestBody & {
    platformId: string
    isDefault?: boolean
    generatedForProjectId?: string | null
    key?: string | null
    config?: PieceSetConfig
}

type UpdateParams = {
    id: string
    platformId: string
    request: UpdatePieceSetRequestBody
}

type DeleteParams = {
    id: string
    platformId: string
}

type AssignProjectParams = {
    connectorSet: ConnectorSet
    projectId: string
    entityManager?: EntityManager
}

type AssignProjectsParams = {
    connectorSetId: string
    platformId: string
    projectIds: string[]
    entityManager?: EntityManager
}

export const connectorSetService = (log: FastifyBaseLogger) => ({
    async getOrCreateDefaultConnectorSet(platformId: string): Promise<ConnectorSet> {
        const existing = await connectorSetRepo().findOneBy({ platformId, isDefault: true })
        if (!isNil(existing)) return existing

        return distributedLock(log).runExclusive({
            key: `piece_set_default_${platformId}`,
            timeoutInSeconds: 60,
            fn: async () => {
                const existing = await connectorSetRepo().findOneBy({ platformId, isDefault: true })
                if (!isNil(existing)) return existing

                await connectorSetRepo().save(connectorSetConfig.buildDefaultSet(platformId))
                return connectorSetRepo().findOneByOrFail({ platformId, isDefault: true })
            },
        })
    },

    async list({ platformId, cursor, limit = 10 }: ListParams): Promise<SeekPage<ConnectorSet>> {
        const boundedLimit = Math.min(limit, MAX_PIECE_SET_PAGE_SIZE)
        const qb = connectorSetRepo()
            .createQueryBuilder('ps')
            .where('ps.platformId = :platformId', { platformId })
            .orderBy('ps.created', 'ASC')
            .addOrderBy('ps.id', 'ASC')
            .take(boundedLimit + 1)

        if (cursor) {
            qb.andWhere(
                '(ps.created, ps.id) > (SELECT created, id FROM piece_set WHERE id = :cursorId AND "platformId" = :platformId)',
                { cursorId: cursor, platformId },
            )
        }

        const rows = await qb.getMany()
        const hasMore = rows.length > boundedLimit
        const data = hasMore ? rows.slice(0, boundedLimit) : rows

        return {
            data,
            next: hasMore ? data[data.length - 1].id : null,
            previous: cursor ? data[0]?.id ?? null : null,
        }
    },

    async getOne({ id, platformId }: GetOneParams): Promise<ConnectorSet> {
        const set = await connectorSetRepo().findOneBy({ id, platformId })
        if (isNil(set)) {
            throw new ActivepiecesError({
                code: ErrorCode.ENTITY_NOT_FOUND,
                params: { entityType: 'ConnectorSet', entityId: id },
            })
        }
        return set
    },

    async create({ platformId, name, key, isDefault = false, generatedForProjectId = null, config }: CreateParams): Promise<ConnectorSet> {
        const id = apId()
        const { error } = await tryCatch(() => connectorSetRepo().save({
            id,
            platformId,
            name,
            key: resolveKey({ key, name }),
            isDefault,
            generatedForProjectId,
            config: config ?? connectorSetConfig.emptyConfig(),
        }))
        if (error) {
            rethrowKeyConflict(error)
        }
        return connectorSetRepo().findOneByOrFail({ id })
    },

    async update({ id, platformId, request }: UpdateParams): Promise<ConnectorSet> {
        const existing = await this.getOne({ id, platformId })

        const updatedConfig = connectorSetConfig.applyUpdate({ current: existing.config, request })

        const { error } = await tryCatch(() => connectorSetRepo().update({ id, platformId }, {
            ...spreadIfDefined('name', request.name),
            ...(request.key !== undefined ? { key: resolveKey({ key: request.key, name: request.name ?? existing.name }) } : {}),
            config: updatedConfig,
        }))
        if (error) {
            rethrowKeyConflict(error)
        }

        return this.getOne({ id, platformId })
    },

    async delete({ id, platformId }: DeleteParams): Promise<void> {
        const set = await this.getOne({ id, platformId })

        if (set.isDefault) {
            throw new ActivepiecesError({
                code: ErrorCode.VALIDATION,
                params: { message: 'Cannot delete the default piece set' },
            })
        }

        const defaultSet = await this.getOrCreateDefaultConnectorSet(platformId)

        await transaction(async (em) => {
            await em
                .createQueryBuilder()
                .update('project')
                .set({ connectorSetId: defaultSet.id })
                .where('"connectorSetId" = :connectorSetId', { connectorSetId: id })
                .andWhere('"platformId" = :platformId', { platformId })
                .execute()

            await em.delete(ConnectorSetEntity, { id, platformId })
        })
    },

    async duplicate({ id, platformId, name }: GetOneParams & { name: string }): Promise<ConnectorSet> {
        const original = await this.getOne({ id, platformId })
        return this.create({
            platformId,
            name,
            key: undefined,
            isDefault: false,
            generatedForProjectId: null,
            config: original.config,
        })
    },

    // Takes the fetched set (not an id) so hot paths like managed-authn skip a redundant validation query
    async assignProject({ connectorSet, projectId, entityManager }: AssignProjectParams): Promise<void> {
        const repo = entityManager
            ? entityManager.getRepository('project')
            : connectorSetRepo().manager.getRepository('project')

        await repo.update({ id: projectId, platformId: connectorSet.platformId }, { connectorSetId: connectorSet.id })
    },

    async assignProjects({ connectorSetId, platformId, projectIds, entityManager }: AssignProjectsParams): Promise<void> {
        if (projectIds.length === 0) return

        await this.getOne({ id: connectorSetId, platformId })

        const repo = entityManager
            ? entityManager.getRepository('project')
            : connectorSetRepo().manager.getRepository('project')

        await repo.update({ id: In(projectIds), platformId }, { connectorSetId })
    },

    async removeProjectAssignment({ connectorSetId, platformId, projectId }: { connectorSetId: string, platformId: string, projectId: string }): Promise<void> {
        const set = await this.getOne({ id: connectorSetId, platformId })
        if (set.isDefault) {
            throw new ActivepiecesError({
                code: ErrorCode.VALIDATION,
                params: { message: 'Cannot remove project from the default piece set' },
            })
        }
        const defaultSet = await this.getOrCreateDefaultConnectorSet(platformId)
        await connectorSetRepo().manager.getRepository('project').update(
            { id: projectId, platformId, connectorSetId },
            { connectorSetId: defaultSet.id },
        )
    },
})

function resolveKey({ key, name }: { key?: string | null, name: string }): string {
    if (!isNil(key) && key.trim().length > 0) {
        return key
    }
    return `${kebabCase(name)}-${apId().slice(0, 8)}`
}

function rethrowKeyConflict(error: unknown): never {
    const driverError: unknown = error instanceof QueryFailedError ? error.driverError : undefined
    if (typeof driverError === 'object' && driverError !== null && 'code' in driverError && driverError.code === '23505') {
        throw new ActivepiecesError({
            code: ErrorCode.VALIDATION,
            params: { message: 'Piece set key already used' },
        })
    }
    throw error
}
