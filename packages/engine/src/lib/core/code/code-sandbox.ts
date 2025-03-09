import { logger, SharedSystemProp, system } from '@openops/server-shared';
import { assertNotNullOrUndefined } from '@openops/shared';
import { CodeSandbox } from '../../core/code/code-sandbox-common';
import { ExecutionMode } from './execution-mode';

const executionMode = system.get<ExecutionMode>(
  SharedSystemProp.EXECUTION_MODE,
);

const loadNoOpCodeSandbox = async (): Promise<CodeSandbox> => {
  const noOpCodeSandboxModule = await import('./no-op-code-sandbox');
  return noOpCodeSandboxModule.noOpCodeSandbox;
};

const loadV8IsolateSandbox = async (): Promise<CodeSandbox> => {
  const v8IsolateCodeSandboxModule = await import('./v8-isolate-code-sandbox');
  return v8IsolateCodeSandboxModule.v8IsolateCodeSandbox;
};

const loadCodeSandbox = async (): Promise<CodeSandbox> => {
  const loaders = {
    [ExecutionMode.UNSANDBOXED]: loadNoOpCodeSandbox,
    [ExecutionMode.SANDBOXED]: loadNoOpCodeSandbox,
    [ExecutionMode.SANDBOX_CODE_ONLY]: loadV8IsolateSandbox,
  };
  assertNotNullOrUndefined(executionMode, 'OPS_EXECUTION_MODE');
  logger.debug(`Loading code sandbox for execution mode: ${executionMode}`);
  const loader = loaders[executionMode];
  return loader();
};

let instance: CodeSandbox | null = null;

export const initCodeSandbox = async (): Promise<CodeSandbox> => {
  if (instance === null) {
    instance = await loadCodeSandbox();
  }
  return instance;
};
