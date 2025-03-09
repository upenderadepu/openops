import {
  buildUserAccountApiKey,
  createAnodotAuthHeaders,
} from '../../src/lib/common/anodot-requests-helpers';

describe('createAnodotAuthHeaders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create auth headers for the given token and api key', async () => {
    const result = createAnodotAuthHeaders('authToken', 'accountApiKey');

    expect(result['Authorization']).toEqual('authToken');
    expect(result['Content-Type']).toEqual('application/json');
    expect(result['apikey']).toEqual('accountApiKey');
  });
});

describe('buildUserAccountApiKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should build key based on account key and division id', async () => {
    const result = buildUserAccountApiKey('accountApiKey', '1', '2');

    expect(result).toEqual('accountApiKey:1:2');
  });
});
