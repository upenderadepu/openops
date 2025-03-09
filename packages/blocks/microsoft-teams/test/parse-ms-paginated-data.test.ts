import { Client } from '@microsoft/microsoft-graph-client';
import { DropdownOption } from '@openops/blocks-framework';
import { parseMsPaginatedData } from '../src/lib/common/parse-ms-paginated-data';

const mockGet = jest.fn();

const mockClient = {
  api: jest.fn(() => ({ get: mockGet })),
} as unknown as Client;

const populateFn = (options: DropdownOption<string>[], item: any) =>
  options.push(item);

describe('parseMsPaginatedData', () => {
  let options: DropdownOption<string>[];
  beforeEach(() => {
    jest.clearAllMocks();
    options = [];
  });

  it('should handle a single page of data', async () => {
    const mockResponse = { value: [{ id: '1' }, { id: '2' }] };
    await parseMsPaginatedData(mockClient, mockResponse, options, populateFn);

    expect(mockGet).not.toHaveBeenCalled();
    expect(options).toEqual(mockResponse.value);
  });

  it('should handle multiple pages of data', async () => {
    const mockResponse1 = {
      value: [{ id: '1' }, { id: '2' }],
      '@odata.nextLink': 'https://next-page-url',
    };
    const mockResponse2 = { value: [{ id: '3' }, { id: '4' }] };

    mockGet.mockResolvedValueOnce(mockResponse2);
    await parseMsPaginatedData(mockClient, mockResponse1, options, populateFn);

    expect(options).toEqual([...mockResponse1.value, ...mockResponse2.value]);
  });

  it('should not fail when response.value is empty', async () => {
    const mockResponse = { value: [] };
    await parseMsPaginatedData(mockClient, mockResponse, options, populateFn);

    expect(options).toEqual([]);
  });
});
