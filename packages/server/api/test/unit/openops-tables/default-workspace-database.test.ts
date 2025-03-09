const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  makeOpenOpsTablesPost: jest.fn(),
  makeOpenOpsTablesPatch: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

const createDbMock = jest.fn();
jest.mock('../../../src/app/openops-tables/create-database', () => {
  return { createDatabase: createDbMock };
});

const createTableMock = jest.fn();
jest.mock('../../../src/app/openops-tables/create-table', () => {
  return { createTable: createTableMock };
});

const createWorkspaceMock = jest.fn();
jest.mock('../../../src/app/openops-tables/create-workspace', () => {
  return { createWorkspace: createWorkspaceMock };
});

const addFieldsToOpenopsDefaultTableMock = jest.fn();
jest.mock(
  '../../../src/app/openops-tables/add-fields-to-openops-default-table',
  () => {
    return {
      addFieldsToOpenopsDefaultTable: addFieldsToOpenopsDefaultTableMock,
    };
  },
);

import { OPENOPS_DEFAULT_DATABASE_NAME } from '@openops/common';
import { createDefaultWorkspaceAndDatabase } from '../../../src/app/openops-tables/default-workspace-database';

describe('createAdminInOpenOpsTables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const token = 'some token';

  it('should successfully create new table Opportunities', async () => {
    createWorkspaceMock.mockResolvedValue({ id: 1 });
    createDbMock.mockResolvedValue({ id: 2 });
    createTableMock.mockResolvedValue({ id: 3 });

    await createDefaultWorkspaceAndDatabase(token);

    expect(createWorkspaceMock).toHaveBeenCalledTimes(1);
    expect(createWorkspaceMock).toHaveBeenCalledWith(
      'OpenOps Workspace',
      'some token',
    );
    expect(createDbMock).toHaveBeenCalledTimes(1);
    expect(createDbMock).toHaveBeenCalledWith(
      1,
      OPENOPS_DEFAULT_DATABASE_NAME,
      'some token',
    );
    expect(createTableMock).toHaveBeenCalledTimes(1);
    expect(createTableMock).toHaveBeenCalledWith(
      2,
      'Opportunities',
      [['ID']],
      'some token',
    );
    expect(addFieldsToOpenopsDefaultTableMock).toHaveBeenCalledTimes(1);
    expect(addFieldsToOpenopsDefaultTableMock).toHaveBeenCalledWith(
      'some token',
      3,
    );
  });

  it('should throw if something fails', async () => {
    createWorkspaceMock.mockRejectedValue(new Error('some error'));

    await expect(createDefaultWorkspaceAndDatabase(token)).rejects.toThrow(
      'some error',
    );
  });
});
