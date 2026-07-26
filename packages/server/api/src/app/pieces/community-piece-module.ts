import { PieceMetadataModel } from '@wippa/connectors-framework'
import { AddPieceRequestBody, PrincipalType } from '@wippa/shared'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'
import { securityAccess } from '../core/security/authorization/fastify-security'
import { attachMultipartFieldsToBody } from '../helper/multipart-body'
import { connectorInstallService } from './piece-install-service'

export const communityPiecesModule: FastifyPluginAsyncZod = async (app) => {
    await app.register(communityPiecesController, { prefix: '/v1/pieces' })
}

const communityPiecesController: FastifyPluginAsyncZod = async (app) => {
    app.post(
        '/',
        {
            config: {
                security: securityAccess.platformAdminOnly([PrincipalType.USER, PrincipalType.SERVICE]),
            },
            preValidation: attachMultipartFieldsToBody,
            schema: {
                body: AddPieceRequestBody,
            },
        },
        async (req, res): Promise<PieceMetadataModel> => {
            const platformId = req.principal.platform.id
            const connectorMetadata = await connectorInstallService(req.log).installConnector(
                platformId,
                req.body,
            )
            return res.code(StatusCodes.CREATED).send(connectorMetadata)
        },
    )
}
