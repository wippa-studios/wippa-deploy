import { FlowActionType } from '../actions/action'
import { FlowTrigger, FlowTriggerType } from '../triggers/trigger'
import { flowStructureUtil } from '../util/flow-structure-util'

export const flowPieceUtil = {
    getExactVersion(connectorVersion: string): string {
        if (connectorVersion.startsWith('^') || connectorVersion.startsWith('~')) {
            return connectorVersion.slice(1)
        }
        return connectorVersion
    },
    getUsedPieces(trigger: FlowTrigger): string[] {
        return flowStructureUtil.getAllSteps(trigger)
            .filter((step) => step.type === FlowActionType.PIECE || step.type === FlowTriggerType.PIECE)
            .map((step) => step.settings.connectorName)
    },
}
