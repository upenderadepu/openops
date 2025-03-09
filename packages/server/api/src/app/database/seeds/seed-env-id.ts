import { logger } from '@openops/server-shared';
import { FlagId, isEmpty } from '@openops/shared';
import { randomUUID, UUID } from 'node:crypto';
import { FlagEntity } from '../../flags/flag.entity';
import { databaseConnection } from '../database-connection';

const getEnvironmentId = async (): Promise<UUID | undefined> => {
  const flagRepo = databaseConnection().getRepository(FlagEntity);
  const devSeedsFlag = await flagRepo.findOneBy({
    id: FlagId.ENVIRONMENT_ID,
  });

  if (devSeedsFlag !== null && !isEmpty(devSeedsFlag.value)) {
    return devSeedsFlag.value as UUID;
  }

  return undefined;
};

const setEnvironmentId = async (): Promise<UUID> => {
  const flagRepo = databaseConnection().getRepository(FlagEntity);

  const envId = randomUUID();

  await flagRepo.save({
    id: FlagId.ENVIRONMENT_ID,
    value: envId,
  });

  return envId;
};

export const seedEnvironmentId = async (): Promise<UUID> => {
  const envId = await getEnvironmentId();
  if (envId) {
    logger.info('Skip: EnvironmentId already created.', {
      name: 'seedEnvironmentId',
    });
    return envId;
  }

  return setEnvironmentId();
};
