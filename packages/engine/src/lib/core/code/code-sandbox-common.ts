export type CodeModule = {
  code(input: unknown): Promise<unknown>;
};

export type CodeSandbox = {
  /**
   * Executes a {@link CodeModule}.
   */
  runCodeModule(params: RunCodeModuleParams): Promise<unknown>;

  /**
   * Executes a script.
   */
  runScript(params: RunScriptParams): Promise<unknown>;
};

type RunCodeModuleParams = {
  /**
   * The path of the code file.
   */
  codeFile: string;

  /**
   * Whether the import should be fresh or not.
   */
  isFreshImport: boolean;

  /**
   * The inputs that are passed to the {@link CodeModule}.
   */
  inputs: Record<string, unknown>;
};

type RunScriptParams = {
  /**
   * A serialized script that will be executed in the sandbox.
   * The script can either be sync or async.
   */
  script: string;

  /**
   * A key-value map of variables available to the script during execution.
   */
  scriptContext: Record<string, unknown>;
};
