const loggerMock = {
  error: jest.fn(),
  info: jest.fn(),
};

jest.mock('@openops/server-shared', () => ({
  ...jest.requireActual('@openops/server-shared'),
  logger: loggerMock,
}));

const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  createAxiosHeadersForAnalytics: jest.fn(),
  makeOpenOpsAnalyticsPost: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

import { enableEmbeddedMode } from '../../../src/app/openops-analytics/enable-embedded-mode';

describe('enableEmbeddedMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPS_FRONTEND_URL = 'some url';
  });

  test('should succesfully enable embedded mode', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsPost.mockResolvedValue('mock result');
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );
    const result = await enableEmbeddedMode('some token', 1);

    expect(result).toEqual('mock result');
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'dashboard/1/embedded',
      { allowed_domains: ['some url'] },
      'some header',
    );
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledTimes(1);
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledWith('some token');
    expect(loggerMock.info).toHaveBeenCalledTimes(1);
    expect(loggerMock.info).toHaveBeenCalledWith(
      'Enabling embedded mode for dashboard with id: 1.',
      { dashboardId: 1 },
    );
  });

  test('should log error if provided id is undefined', async () => {
    const result = await enableEmbeddedMode('some token', undefined);

    expect(result).toEqual(undefined);
    expect(loggerMock.error).toHaveBeenCalledTimes(1);
    expect(loggerMock.error).toHaveBeenCalledWith(
      'Not enabling embeded mode as provided ID is undefined.',
    );
  });
});
