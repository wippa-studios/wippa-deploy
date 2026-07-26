import { apId, isNil } from '@wippa/core-utils'
import { PropertyType } from '@wippa/connectors-framework'
import { AppConnection, AppConnectionScope, AppConnectionStatus, AppConnectionType, CustomAuthConnectionValue, PackageType, ConnectorType } from '@wippa/shared'
import dayjs from 'dayjs'
import { FastifyBaseLogger, FastifyInstance } from 'fastify'
import { appConnectionHandler } from '../../../../src/app/app-connection/app-connection-service/app-connection.handler'
import { db } from '../../../helpers/db'
import { createMockPieceMetadata } from '../../../helpers/mocks'
import { setupTestEnvironment, teardownTestEnvironment } from '../../../helpers/test-setup'

let app: FastifyInstance | null = null
let mockLog: FastifyBaseLogger

beforeAll(async () => {
    app = await setupTestEnvironment()
    mockLog = app!.log!
})

afterAll(async () => {
    await teardownTestEnvironment()
})

const customAuthOf = (overrides: Record<string, unknown>) => ({
    type: PropertyType.CUSTOM_AUTH,
    displayName: 'Connection',
    required: true,
    props: {},
    ...overrides,
})

const saveCustomAuthPiece = async ({ connectorName, connectorVersion, platformId, hasRefresh }: { connectorName: string, connectorVersion: string, platformId: string | undefined, hasRefresh: boolean }): Promise<void> => {
    const mockPiece = createMockPieceMetadata({
        name: connectorName,
        version: connectorVersion,
        platformId,
        pieceType: isNil(platformId) ? ConnectorType.OFFICIAL : ConnectorType.CUSTOM,
        packageType: PackageType.REGISTRY,
        minimumSupportedRelease: '0.0.0',
        maximumSupportedRelease: '999.999.999',
        // Functions (generate) do not survive metadata serialization; the stored
        // refresh is a plain object, so detection only checks for its presence.
        auth: customAuthOf(hasRefresh ? { refresh: { defaultExpiresIn: 3300 } } : {}),
    })
    await db.save('piece_metadata', mockPiece)
}

const customAuthConnection = ({ platformId, connectorName, connectorVersion, value }: { platformId: string, connectorName: string, connectorVersion: string, value: CustomAuthConnectionValue }): AppConnection => ({
    id: apId(),
    created: dayjs().toISOString(),
    updated: dayjs().toISOString(),
    platformId,
    projectIds: [apId()],
    connectorName,
    connectorVersion,
    displayName: 'Test Custom Auth',
    type: AppConnectionType.CUSTOM_AUTH,
    scope: AppConnectionScope.PROJECT,
    status: AppConnectionStatus.ACTIVE,
    ownerId: apId(),
    value,
    metadata: {},
    externalId: apId(),
    owner: null,
    preSelectForNewProjects: false,
})

describe('Custom auth token refresh — needRefresh', () => {
    describe('refresh-support detection from stored metadata', () => {
        it('returns true when the piece metadata declares a refresh callback', async () => {
            const connectorName = `piece-${apId()}`
            const platformId = apId()
            await saveCustomAuthPiece({ connectorName, connectorVersion: '1.0.0', platformId, hasRefresh: true })

            const connection = customAuthConnection({
                platformId,
                connectorName,
                connectorVersion: '1.0.0',
                value: { type: AppConnectionType.CUSTOM_AUTH, props: {} },
            })

            const result = await appConnectionHandler(mockLog).needRefresh(connection, mockLog)
            expect(result).toBe(true)
        })

        it('returns false when the piece metadata has no refresh callback', async () => {
            const connectorName = `piece-${apId()}`
            const platformId = apId()
            await saveCustomAuthPiece({ connectorName, connectorVersion: '1.0.0', platformId, hasRefresh: false })

            const connection = customAuthConnection({
                platformId,
                connectorName,
                connectorVersion: '1.0.0',
                value: { type: AppConnectionType.CUSTOM_AUTH, props: {} },
            })

            const result = await appConnectionHandler(mockLog).needRefresh(connection, mockLog)
            expect(result).toBe(false)
        })
    })

    describe('per-platform cache scoping', () => {
        it('resolves each platform independently when two platforms share a piece name@version with different refresh support', async () => {
            const connectorName = `piece-${apId()}`
            const connectorVersion = '1.0.0'
            const platformWithRefresh = apId()
            const platformWithoutRefresh = apId()

            await saveCustomAuthPiece({ connectorName, connectorVersion, platformId: platformWithRefresh, hasRefresh: true })
            await saveCustomAuthPiece({ connectorName, connectorVersion, platformId: platformWithoutRefresh, hasRefresh: false })

            const connWithRefresh = customAuthConnection({
                platformId: platformWithRefresh,
                connectorName,
                connectorVersion,
                value: { type: AppConnectionType.CUSTOM_AUTH, props: {} },
            })
            const connWithoutRefresh = customAuthConnection({
                platformId: platformWithoutRefresh,
                connectorName,
                connectorVersion,
                value: { type: AppConnectionType.CUSTOM_AUTH, props: {} },
            })

            // Warm the cache for the refresh-supporting platform first; a key that
            // ignored platformId would then leak `true` to the other platform.
            expect(await appConnectionHandler(mockLog).needRefresh(connWithRefresh, mockLog)).toBe(true)
            expect(await appConnectionHandler(mockLog).needRefresh(connWithoutRefresh, mockLog)).toBe(false)
        })
    })

    describe('token branch', () => {
        it('uses token staleness without a metadata lookup when a token is already present', async () => {
            // No piece_metadata row is saved — if needRefresh consulted metadata it would throw.
            const connectorName = `piece-${apId()}`

            const staleConnection = customAuthConnection({
                platformId: apId(),
                connectorName,
                connectorVersion: '1.0.0',
                value: { type: AppConnectionType.CUSTOM_AUTH, props: {}, access_token: 'tok', token_refresh_at: dayjs().unix() - 60 },
            })
            expect(await appConnectionHandler(mockLog).needRefresh(staleConnection, mockLog)).toBe(true)

            const freshConnection = customAuthConnection({
                platformId: apId(),
                connectorName,
                connectorVersion: '1.0.0',
                value: { type: AppConnectionType.CUSTOM_AUTH, props: {}, access_token: 'tok', token_refresh_at: dayjs().unix() + 3600 },
            })
            expect(await appConnectionHandler(mockLog).needRefresh(freshConnection, mockLog)).toBe(false)
        })
    })
})
