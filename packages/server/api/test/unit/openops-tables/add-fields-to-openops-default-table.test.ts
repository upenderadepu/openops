const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  makeOpenOpsTablesPost: jest.fn(),
  makeOpenOpsTablesPatch: jest.fn(),
  getFields: jest.fn(),
  createAxiosHeaders: jest.fn(),
  getPrimaryKeyFieldFromFields: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

import { addFieldsToOpenopsDefaultTable } from '../../../src/app/openops-tables/add-fields-to-openops-default-table';

describe('addFieldsToOpenopsDefaultTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should succesfully add new fields', async () => {
    openopsCommonMock.createAxiosHeaders.mockReturnValue('some header');
    openopsCommonMock.getFields.mockReturnValue(['a field']);
    openopsCommonMock.getPrimaryKeyFieldFromFields.mockReturnValue({ id: 1 });

    await addFieldsToOpenopsDefaultTable('some token', 2);

    expect(openopsCommonMock.makeOpenOpsTablesPatch).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsTablesPatch).toHaveBeenCalledWith(
      'api/database/fields/1/',
      { name: 'ID', type: 'uuid' },
      'some header',
    );
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenCalledTimes(7);
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenNthCalledWith(
      1,
      'api/database/fields/table/2/',
      { name: 'Resource ID', type: 'long_text' },
      'some header',
    );
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenNthCalledWith(
      2,
      'api/database/fields/table/2/',
      { name: 'Workflow name', type: 'long_text' },
      'some header',
    );
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenNthCalledWith(
      3,
      'api/database/fields/table/2/',
      {
        name: 'Creation time',
        type: 'created_on',
        date_format: 'ISO',
        date_include_time: true,
      },
      'some header',
    );
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenNthCalledWith(
      4,
      'api/database/fields/table/2/',
      {
        name: 'Last modified time',
        type: 'last_modified',
        date_format: 'ISO',
        date_include_time: true,
      },
      'some header',
    );
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenNthCalledWith(
      5,
      'api/database/fields/table/2/',
      {
        name: 'Status',
        type: 'single_select',
        select_options: [
          { value: 'Created', color: 'blue' },
          { value: 'Approved', color: 'green' },
          { value: 'Snoozed', color: 'light-yellow' },
          { value: 'Dismissed', color: 'red' },
          { value: 'Closed', color: 'gray' },
        ],
      },
      'some header',
    );
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenNthCalledWith(
      6,
      'api/database/fields/table/2/',
      {
        name: 'Snoozed until',
        type: 'date',
        date_format: 'ISO',
        date_include_time: true,
      },
      'some header',
    );
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenNthCalledWith(
      7,
      'api/database/fields/table/2/',
      {
        name: 'Estimated savings USD per month',
        type: 'number',
        number_decimal_places: 2,
      },
      'some header',
    );
  });

  it('should throw if something fails', async () => {
    openopsCommonMock.getFields.mockRejectedValue(new Error('some error'));

    await expect(
      addFieldsToOpenopsDefaultTable('some token', 2),
    ).rejects.toThrow('some error');
  });
});
