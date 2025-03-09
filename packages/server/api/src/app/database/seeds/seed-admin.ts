import { AppSystemProp, logger, system } from '@openops/server-shared';
import { authenticationService } from '../../authentication/authentication-service';
import { Provider } from '../../authentication/authentication-service/hooks/authentication-service-hooks';
import { FlagEntity } from '../../flags/flag.entity';
import { databaseConnection } from '../database-connection';

const ADMIN_SEEDED_FLAG = 'ADMIN_DATA_SEEDED';

const adminDataAlreadySeeded = async (): Promise<boolean> => {
  const flagRepo = databaseConnection().getRepository(FlagEntity);
  const devSeedsFlag = await flagRepo.findOneBy({ id: ADMIN_SEEDED_FLAG });
  return devSeedsFlag?.value === true;
};

const setAdminDataSeededFlag = async (): Promise<void> => {
  const flagRepo = databaseConnection().getRepository(FlagEntity);

  await flagRepo.save({
    id: ADMIN_SEEDED_FLAG,
    value: true,
  });
};

export const seedAdminData = async (): Promise<void> => {
  if (await adminDataAlreadySeeded()) {
    logger.info('Skip: Admin already seeded', { name: 'seedAdminData' });
    return;
  }

  const email = system.getOrThrow(AppSystemProp.OPENOPS_ADMIN_EMAIL);
  const password = system.getOrThrow(AppSystemProp.OPENOPS_ADMIN_PASSWORD);

  await authenticationService.signUp({
    email,
    password,
    firstName: 'OpenOps',
    lastName: 'Admin',
    trackEvents: false,
    newsLetter: false,
    verified: true,
    organizationId: null,
    provider: Provider.EMAIL,
  });

  await setAdminDataSeededFlag();
};
