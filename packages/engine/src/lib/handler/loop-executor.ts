import { Store } from '@openops/blocks-framework';
import {
  Action,
  FlowRunStatus,
  isNil,
  LoopOnItemsAction,
  LoopStepOutput,
  LoopStepResult,
} from '@openops/shared';
import { nanoid } from 'nanoid';
import { createContextStore } from '../services/storage.service';
import { BaseExecutor } from './base-executor';
import { EngineConstants } from './context/engine-constants';
import {
  ExecutionVerdict,
  FlowExecutorContext,
} from './context/flow-execution-context';
import { flowExecutor } from './flow-executor';

type LoopOnActionResolvedSettings = {
  items: readonly unknown[];
};

export const loopExecutor: BaseExecutor<LoopOnItemsAction> = {
  async handle({
    action,
    executionState,
    constants,
  }: {
    action: LoopOnItemsAction;
    executionState: FlowExecutorContext;
    constants: EngineConstants;
  }) {
    const payload = constants.resumePayload?.queryParams as {
      executionCorrelationId: string;
      path: string;
    };

    const { resolvedInput, censoredInput } =
      await constants.variableService.resolve<LoopOnActionResolvedSettings>({
        unresolvedInput: {
          items: action.settings.items,
        },
        executionState,
      });

    let stepOutput = LoopStepOutput.init({
      input: censoredInput,
    });

    const store = createContextStore({
      apiUrl: constants.internalApiUrl,
      prefix: `Loop_${constants.flowRunId}_${action.name}`,
      flowId: constants.flowId,
      flowRunId: constants.flowRunId,
      engineToken: constants.engineToken,
    });

    const firstLoopAction = action.firstLoopAction;

    if (isNil(firstLoopAction) || constants.testSingleStepMode) {
      stepOutput = stepOutput.setItemAndIndex({
        index: 1,
        item: resolvedInput.items[0],
      });

      return executionState.upsertStep(action.name, stepOutput);
    }

    const isFirstLoopExecution = !payload;
    if (isFirstLoopExecution) {
      const loopIterations = triggerLoopIterations(
        resolvedInput,
        executionState,
        stepOutput,
        constants,
        action,
        firstLoopAction,
      );

      if (loopIterations.length === 0) {
        return executionState.upsertStep(action.name, stepOutput);
      }

      return waitForIterationsToFinishOrPause(
        loopIterations,
        action.name,
        store,
      );
    }

    await resumePausedIteration(
      store,
      payload,
      executionState,
      constants,
      firstLoopAction,
      action.name,
    );

    const numberOfIterations = resolvedInput.items.length;

    return generateNextFlowContext(store, executionState, numberOfIterations);
  },
};

function triggerLoopIterations(
  resolvedInput: LoopOnActionResolvedSettings,
  loopExecutionState: FlowExecutorContext,
  stepOutput: LoopStepOutput,
  constants: EngineConstants,
  action: LoopOnItemsAction,
  firstLoopAction: Action,
): Promise<FlowExecutorContext>[] {
  const loopIterations: Promise<FlowExecutorContext>[] = [];

  for (let i = 0; i < resolvedInput.items.length; ++i) {
    const newCurrentPath = loopExecutionState.currentPath.loopIteration({
      loopName: action.name,
      iteration: i,
    });
    stepOutput = stepOutput.setItemAndIndex({
      index: i + 1,
      item: resolvedInput.items[i],
    });

    const addEmptyIteration = !stepOutput.hasIteration(i);
    if (addEmptyIteration) {
      stepOutput = stepOutput.addIteration();
    }

    // Generate new pauseId for each iteration
    const newId = nanoid();
    const newExecutionContext = loopExecutionState
      .upsertStep(action.name, stepOutput)
      .setCurrentPath(newCurrentPath)
      .setPauseId(newId);

    loopIterations[i] = flowExecutor.execute({
      executionState: newExecutionContext,
      action: firstLoopAction,
      constants,
    });
  }

  return loopIterations;
}

async function waitForIterationsToFinishOrPause(
  loopIterations: Promise<FlowExecutorContext>[],
  actionName: string,
  store: Store,
): Promise<FlowExecutorContext> {
  const iterationResults: {
    iterationContext: FlowExecutorContext;
    isPaused: boolean;
  }[] = [];
  let noPausedIterations = true;

  for (const iteration of loopIterations) {
    const iterationContext = await iteration;
    const { verdict, verdictResponse } = iterationContext;

    if (verdict === ExecutionVerdict.FAILED) {
      return iterationContext.setCurrentPath(
        iterationContext.currentPath.removeLast(),
      );
    }

    const isPaused =
      verdict === ExecutionVerdict.PAUSED &&
      verdictResponse?.reason === FlowRunStatus.PAUSED;

    if (isPaused) {
      noPausedIterations = false;
    }

    iterationResults.push({ iterationContext, isPaused });
  }

  const { iterationContext: lastIterationContext } =
    iterationResults[iterationResults.length - 1];
  const executionState = lastIterationContext.setCurrentPath(
    lastIterationContext.currentPath.removeLast(),
  );

  if (noPausedIterations) {
    return executionState;
  }

  await saveIterationResults(store, actionName, iterationResults);
  return pauseLoop(executionState);
}

async function saveIterationResults(
  store: Store,
  actionName: string,
  iterationResults: {
    iterationContext: FlowExecutorContext;
    isPaused: boolean;
  }[],
): Promise<void> {
  for (let i = 0; i < iterationResults.length; ++i) {
    const { iterationContext, isPaused } = iterationResults[i];

    const iterationOutput = iterationContext.currentState()[
      actionName
    ] as LoopStepResult;
    if (isPaused) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await store.put(iterationContext.currentPath.toString(), i);
    }

    await storeIterationResult(
      `${i}`,
      isPaused,
      iterationOutput.index,
      iterationOutput.item,
      store,
    );
  }
}

async function resumePausedIteration(
  store: Store,
  payload: { executionCorrelationId: string; path: string },
  loopExecutionState: FlowExecutorContext,
  constants: EngineConstants,
  firstLoopAction: Action,
  actionName: string,
): Promise<void> {
  // Get which iteration is being resumed
  const iterationKey = (await store.get(payload.path)) as string;
  const previousIterationResult = (await store.get(
    iterationKey,
  )) as IterationResult;

  const loopOutput = loopExecutionState.steps[actionName]
    .output as LoopStepResult;
  loopOutput.index = Number(previousIterationResult.index);
  loopOutput.item = previousIterationResult.item;

  const newCurrentPath = loopExecutionState.currentPath.loopIteration({
    loopName: actionName,
    iteration: previousIterationResult.index - 1,
  });

  let newExecutionContext = loopExecutionState.setCurrentPath(newCurrentPath);

  newExecutionContext = await flowExecutor.execute({
    executionState: newExecutionContext,
    action: firstLoopAction,
    constants,
  });

  const isPaused = newExecutionContext.verdict === ExecutionVerdict.PAUSED;

  await storeIterationResult(
    iterationKey,
    isPaused,
    previousIterationResult.index,
    previousIterationResult.item,
    store,
  );
}

async function storeIterationResult(
  key: string,
  isPaused: boolean,
  iterationIndex: number,
  iterationItem: unknown,
  store: Store,
): Promise<void> {
  const iterationResult: IterationResult = {
    isPaused,
    index: iterationIndex,
    item: iterationItem,
  };

  await store.put(key, iterationResult);
}

async function generateNextFlowContext(
  store: Store,
  loopExecutionState: FlowExecutorContext,
  numberOfIterations: number,
): Promise<FlowExecutorContext> {
  let areAllStepsInLoopFinished = true;

  for (
    let iterationIndex = 0;
    iterationIndex < numberOfIterations;
    ++iterationIndex
  ) {
    const iterationResult: IterationResult | null = await store.get(
      `${iterationIndex}`,
    );

    if (!iterationResult || iterationResult.isPaused) {
      areAllStepsInLoopFinished = false;
      break;
    }
  }

  return areAllStepsInLoopFinished
    ? loopExecutionState
    : pauseLoop(loopExecutionState);
}

function pauseLoop(executionState: FlowExecutorContext): FlowExecutorContext {
  return executionState.setVerdict(ExecutionVerdict.PAUSED, {
    reason: FlowRunStatus.PAUSED,
    pauseMetadata: {
      executionCorrelationId: executionState.pauseId,
    },
  });
}

type IterationResult = {
  // Iteration input
  item: unknown;
  // Iteration index, starts at 1
  index: number;
  // Iteration state
  isPaused: boolean;
};
