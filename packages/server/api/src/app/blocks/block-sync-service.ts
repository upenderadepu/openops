import {
  BlockMetadataModel,
  BlockMetadataModelSummary,
} from '@openops/blocks-framework';
import { AppSystemProp, logger, system } from '@openops/server-shared';
import {
  BlockSyncMode,
  BlockType,
  ListVersionsResponse,
  PackageType,
} from '@openops/shared';
import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import { repoFactory } from '../core/db/repo-factory';
import { flagService } from '../flags/flag.service';
import { parseAndVerify } from '../helper/json-validator';
import { systemJobsSchedule } from '../helper/system-jobs';
import { SystemJobName } from '../helper/system-jobs/common';
import { systemJobHandlers } from '../helper/system-jobs/job-handlers';
import { BlockMetadataEntity } from './block-metadata-entity';
import { blockMetadataService } from './block-metadata-service';

const CLOUD_API_URL = 'https://cloud.openops.com/api/v1/blocks';
const blocksRepo = repoFactory(BlockMetadataEntity);
const syncMode = system.get<BlockSyncMode>(AppSystemProp.BLOCKS_SYNC_MODE);
export const blockSyncService = {
  async setup(): Promise<void> {
    if (syncMode !== BlockSyncMode.OFFICIAL_AUTO) {
      logger.info('Block sync service is disabled');
      return;
    }
    systemJobHandlers.registerJobHandler(
      SystemJobName.BLOCKS_SYNC,
      async function syncBlocksJobHandler(): Promise<void> {
        await blockSyncService.sync();
      },
    );
    await blockSyncService.sync();
    await systemJobsSchedule.upsertJob({
      job: {
        name: SystemJobName.BLOCKS_SYNC,
        data: {},
      },
      schedule: {
        type: 'repeated',
        cron: '0 */1 * * *',
      },
    });
  },
  async sync(): Promise<void> {
    if (syncMode !== BlockSyncMode.OFFICIAL_AUTO) {
      logger.info('Block sync service is disabled');
      return;
    }
    try {
      logger.info({ time: dayjs().toISOString() }, 'Syncing blocks');
      const blocks = await listBlocks();
      const promises: Promise<void>[] = [];

      for (const summary of blocks) {
        const lastVersionSynced = await existsInDatabase({
          name: summary.name,
          version: summary.version,
        });
        if (!lastVersionSynced) {
          promises.push(syncBlock(summary.name));
        }
      }
      await Promise.all(promises);
    } catch (error) {
      logger.error({ error }, 'Error syncing blocks');
    }
  },
};

async function syncBlock(name: string): Promise<void> {
  try {
    logger.info({ name }, 'Syncing block metadata into database');
    const versions = await getVersions({ name });
    for (const version of Object.keys(versions)) {
      const currentVersionSynced = await existsInDatabase({ name, version });
      if (!currentVersionSynced) {
        const block = await getOrThrow({ name, version });
        await blockMetadataService.create({
          blockMetadata: block,
          packageType: block.packageType,
          blockType: block.blockType,
        });
      }
    }
  } catch (error) {
    logger.error(
      { error },
      'Error syncing block, please upgrade the OpenOps to latest version',
    );
  }
}
async function existsInDatabase({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<boolean> {
  return blocksRepo().existsBy({
    name,
    version,
    blockType: BlockType.OFFICIAL,
    packageType: PackageType.REGISTRY,
  });
}

async function getVersions({
  name,
}: {
  name: string;
}): Promise<ListVersionsResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('edition', system.getEdition());
  queryParams.append('release', await flagService.getCurrentRelease());
  queryParams.append('name', name);
  const url = `${CLOUD_API_URL}/versions?${queryParams.toString()}`;
  const response = await fetch(url);
  return parseAndVerify<ListVersionsResponse>(
    ListVersionsResponse,
    await response.json(),
  );
}

async function getOrThrow({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<BlockMetadataModel> {
  const response = await fetch(
    `${CLOUD_API_URL}/${name}${version ? '?version=' + version : ''}`,
  );
  return response.json();
}

async function listBlocks(): Promise<BlockMetadataModelSummary[]> {
  const queryParams = new URLSearchParams();
  queryParams.append('edition', system.getEdition());
  queryParams.append('release', await flagService.getCurrentRelease());
  const url = `${CLOUD_API_URL}?${queryParams.toString()}`;
  const response = await fetch(url);
  if (response.status === StatusCodes.GONE.valueOf()) {
    logger.error({ name }, 'Block list not found');
    return [];
  }
  if (response.status !== StatusCodes.OK.valueOf()) {
    throw new Error(await response.text());
  }
  return response.json();
}
