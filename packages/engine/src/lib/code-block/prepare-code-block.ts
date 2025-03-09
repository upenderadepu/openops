import {
  logger,
  SharedSystemProp,
  system,
  threadSafeMkdir,
} from '@openops/server-shared';
import path from 'path';
import { CodeArtifact } from './code-artifact';
import { codeBuilder } from './code-builder';

const environmentName = system.get<string>(SharedSystemProp.ENVIRONMENT_NAME);

export async function prepareCodeBlock(
  codeSteps: CodeArtifact[],
): Promise<void> {
  try {
    const globalCodesPath =
      environmentName === 'local'
        ? path.resolve('cache', 'codes')
        : path.resolve('/tmp', 'codes');

    await threadSafeMkdir(globalCodesPath);

    const startTimeCode = performance.now();

    const buildJobs = codeSteps.map(async (artifact) => {
      return codeBuilder.processCodeStep({
        artifact,
        codesFolderPath: globalCodesPath,
      });
    });

    await Promise.all(buildJobs);

    logger.info('Installed code block in engine.', {
      path: globalCodesPath,
      timeTaken: `${Math.floor(performance.now() - startTimeCode)}ms`,
    });
  } catch (error) {
    logger.error('There was a problem configuring the code block.', { error });

    throw error;
  }
}
