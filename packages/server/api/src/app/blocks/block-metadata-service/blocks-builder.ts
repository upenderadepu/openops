import {
  execAsync,
  fileBlocksUtils,
  logger,
  SharedSystemProp,
  system,
} from '@openops/server-shared';
import {
  assertNotNullOrUndefined,
  debounce,
  WebsocketClientEvent,
} from '@openops/shared';
import { Record } from '@sinclair/typebox';
import { Mutex } from 'async-mutex';
import chalk from 'chalk';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import { Server } from 'http';
import { cwd } from 'node:process';
import path, { join, resolve } from 'path';

const mutex = new Mutex();
const isFileBlocks =
  system.getOrThrow(SharedSystemProp.BLOCKS_SOURCE) === 'FILE';
const isDevEnv = system.getOrThrow(SharedSystemProp.ENVIRONMENT) === 'dev';

// We ignore blocks that the server API depends on because the server
// will restart and rebuild anyway
const ignoredBlocks = ['slack'];

async function handleFileChange(
  blockPackageName: string,
  io: Server,
): Promise<void> {
  try {
    await mutex.acquire();

    logger.info(chalk.blue.bold(`Building block ${blockPackageName}...`));
    const cmd = `nx build ${blockPackageName}`;
    await runCommandWithLiveOutput(cmd);
    io.emit(WebsocketClientEvent.REFRESH_BLOCK);
    logger.info(chalk.green.bold(`Block ${blockPackageName} is ready`));
  } catch (error) {
    logger.info(chalk.red.bold(`Failed to build ${blockPackageName}`), {
      error,
    });
  } finally {
    mutex.release();
  }
}

async function runCommandWithLiveOutput(cmd: string): Promise<void> {
  const [command, ...args] = cmd.split(' ');

  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

let initialized = false;

export async function blocksBuilder(io: Server): Promise<void> {
  // Only run this script if the blocks source is file and the environment is dev
  if (!isFileBlocks || !isDevEnv) return;

  const blocks = (
    await fileBlocksUtils.findAllBlocksDirectoryInSource()
  ).filter(
    (blockDirectory) => !ignoredBlocks.includes(path.basename(blockDirectory)),
  );
  logger.info(`Creating watchers for ${blocks.length} blocks`);
  const debouncedPromises: Record<string, Promise<void>> = {};
  for (const blockDirectory of blocks) {
    const packageName = path.basename(blockDirectory);
    assertNotNullOrUndefined(blockDirectory, 'blockDirectory');
    const blockPackageName = `blocks-${packageName}`;
    const debouncedHandleFileChange = debounce(() => {
      debouncedPromises[blockPackageName] = handleFileChange(
        blockPackageName,
        io,
      ).catch(logger.error);
    }, 2000);

    chokidar
      .watch(resolve(blockDirectory), { ignored: /^\./, persistent: true })
      .on('all', (event, path) => {
        if (initialized && path.endsWith('.ts')) {
          debouncedHandleFileChange();
        }
      });
  }

  logger.info('Block watchers created. Building and linking all blocks...');
  const startTime = performance.now();
  await execAsync('nx run-many -t build -p blocks-*');
  const buildDuration = Math.floor(performance.now() - startTime);
  logger.info(
    `Finished building all blocks in ${buildDuration}ms. Linking blocks...`,
  );
  await execAsync(join(cwd(), 'tools/link-packages-to-root.sh'));
  const linkDuration = Math.floor(
    performance.now() - startTime - buildDuration,
  );
  logger.info(`Linked blocks in ${linkDuration}ms. All blocks are ready.`);

  initialized = true;
}
