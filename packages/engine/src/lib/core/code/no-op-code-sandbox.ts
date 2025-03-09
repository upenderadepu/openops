import importFresh from 'import-fresh';
import { CodeModule, CodeSandbox } from './code-sandbox-common';

/**
 * Runs code without a sandbox.
 */
export const noOpCodeSandbox: CodeSandbox = {
  async runCodeModule({ codeFile, isFreshImport, inputs }) {
    const codeModule: CodeModule = isFreshImport
      ? await importFresh(codeFile)
      : await import(codeFile);
    return codeModule.code(inputs);
  },

  async runScript({ script, scriptContext }) {
    const params = Object.keys(scriptContext);
    const args = Object.values(scriptContext);
    const body = `return (${script})`;
    const fn = Function(...params, body);
    return fn(...args);
  },
};
