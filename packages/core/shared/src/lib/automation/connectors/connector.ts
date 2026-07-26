import { z } from 'zod'

export enum PackageType {
    ARCHIVE = 'ARCHIVE',
    REGISTRY = 'REGISTRY',
}

export enum ConnectorType {
    CUSTOM = 'CUSTOM',
    OFFICIAL = 'OFFICIAL',
}

export const PrivatePiecePackage = z.object({
    packageType: z.literal(PackageType.ARCHIVE),
    pieceType: z.nativeEnum(ConnectorType),
    connectorName: z.string(),
    connectorVersion: z.string(),
    archiveId: z.string(),
    platformId: z.string(),
})

export type PrivatePiecePackage = z.infer<typeof PrivatePiecePackage>

export const OfficialPiecePackage = z.object({
    packageType: z.literal(PackageType.REGISTRY),
    pieceType: z.literal(ConnectorType.OFFICIAL),
    connectorName: z.string(),
    connectorVersion: z.string(),
})

export type OfficialPiecePackage = z.infer<typeof OfficialPiecePackage>

export const CustomNpmPiecePackage = z.object({
    packageType: z.literal(PackageType.REGISTRY),
    pieceType: z.literal(ConnectorType.CUSTOM),
    connectorName: z.string(),
    connectorVersion: z.string(),
    platformId: z.string(),
})

export type CustomNpmPiecePackage = z.infer<typeof CustomNpmPiecePackage>

export const PublicPiecePackage = z.union([OfficialPiecePackage, CustomNpmPiecePackage])
export type PublicPiecePackage = OfficialPiecePackage | CustomNpmPiecePackage

export const ConnectorPackage = z.union([PrivatePiecePackage, OfficialPiecePackage, CustomNpmPiecePackage])
export type ConnectorPackage = PrivatePiecePackage | OfficialPiecePackage | CustomNpmPiecePackage

export enum PieceCategory {
    ARTIFICIAL_INTELLIGENCE = 'ARTIFICIAL_INTELLIGENCE',
    COMMUNICATION = 'COMMUNICATION',
    COMMERCE = 'COMMERCE',
    CORE = 'CORE',
    UNIVERSAL_AI = 'UNIVERSAL_AI',
    FLOW_CONTROL = 'FLOW_CONTROL',
    BUSINESS_INTELLIGENCE = 'BUSINESS_INTELLIGENCE',
    ACCOUNTING = 'ACCOUNTING',
    PRODUCTIVITY = 'PRODUCTIVITY',
    CONTENT_AND_FILES = 'CONTENT_AND_FILES',
    DEVELOPER_TOOLS = 'DEVELOPER_TOOLS',
    CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
    FORMS_AND_SURVEYS = 'FORMS_AND_SURVEYS',
    HUMAN_RESOURCES = 'HUMAN_RESOURCES',
    PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
    MARKETING = 'MARKETING',
    SALES_AND_CRM = 'SALES_AND_CRM',
}
