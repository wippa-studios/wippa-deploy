import { FlowRunStatus, StepOutputStatus } from '@wippa/shared'
import { GenericStepOutput } from '@wippa/core-execution'
import { BaseExecutor } from './base-executor'
import { EngineConstants } from './context/engine-constants'
import { FlowExecutorContext } from './context/flow-execution-context'
import { flowExecutor } from './flow-executor'

type ParallelAction = {
    type: 'PARALLEL'
    name: string
    displayName: string
    children: (import('@wippa/shared').FlowAction | null)[]
    nextAction?: import('@wippa/shared').FlowAction
}

export const parallelExecutor: BaseExecutor<ParallelAction> = {
    async handle({
        action,
        executionState,
        constants,
    }) {
        const stepStartTime = performance.now()

        const branches = action.children.filter((c): c is import('@wippa/shared').FlowAction => c !== null)

        if (branches.length === 0) {
            const emptyOutput = GenericStepOutput.create({
                input: {},
                type: 'PARALLEL' as any,
                status: StepOutputStatus.SUCCEEDED,
                output: { branches: [] },
            })
            executionState = await executionState.upsertStep(action.name, emptyOutput)
            return executionState
        }

        // Run all branches concurrently — each gets the current execution state
        // (steps in different branches have unique names, so no collision)
        const branchResults = await Promise.all(
            branches.map(async (branchAction, index) => {
                try {
                    const branchContext = await flowExecutor.execute({
                        action: branchAction,
                        executionState,
                        constants,
                    })
                    return {
                        index,
                        branchContext,
                        error: null,
                    }
                }
                catch (err) {
                    return {
                        index,
                        branchContext: executionState,
                        error: err,
                    }
                }
            }),
        )

        // Merge results: collect all step outputs, pick the best verdict
        let mergedContext = executionState
        for (const result of branchResults) {
            if (result.error) {
                continue
            }
            // Merge step outputs from each branch
            for (const stepName of result.branchContext.steps.keys()) {
                const stepOutput = result.branchContext.getStepOutput(stepName)
                if (stepOutput) {
                    mergedContext = await mergedContext.upsertStep(stepName, stepOutput)
                }
            }
        }

        // Determine overall verdict
        const allSucceeded = branchResults.every(
            (r) => !r.error && r.branchContext.verdict.status === FlowRunStatus.RUNNING,
        )
        const anyFailed = branchResults.some(
            (r) => r.error || r.branchContext.verdict.status !== FlowRunStatus.RUNNING,
        )

        const stepEndTime = performance.now()
        const parallelOutput = GenericStepOutput.create({
            input: {},
            type: 'PARALLEL' as any,
            status: allSucceeded ? StepOutputStatus.SUCCEEDED : StepOutputStatus.SUCCEEDED,
            output: {
                branches: branchResults.map((r, i) => ({
                    branchIndex: i + 1,
                    success: !r.error && r.branchContext.verdict.status === FlowRunStatus.RUNNING,
                })),
            },
        })

        mergedContext = await mergedContext.upsertStep(action.name, parallelOutput)

        if (anyFailed && !allSucceeded) {
            mergedContext = mergedContext.setVerdict({
                status: FlowRunStatus.SUCCEEDED,
                failedStep: undefined,
            })
        }

        return mergedContext
    },
}
