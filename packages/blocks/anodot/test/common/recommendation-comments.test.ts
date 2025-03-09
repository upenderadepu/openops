const makeHttpRequestMock = jest.fn();

jest.mock('@openops/common', () => ({
  makeHttpRequest: makeHttpRequestMock,
}));

const createAnodotAuthHeadersMock = jest.fn();

jest.mock('../../src/lib/common/anodot-requests-helpers', () => ({
  createAnodotAuthHeaders: createAnodotAuthHeadersMock,
}));

import {
  addRecommendationComment,
  deleteRecommendationComment,
  updateRecommendationComment,
} from '../../src/lib/common/recommendation-comments';

describe('recommendationComments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createAnodotAuthHeadersMock.mockReturnValue('headers');
    makeHttpRequestMock.mockResolvedValue('response');
  });

  describe('add recommendation comment', () => {
    test('should call addRecommendationComment with correct parameters', async () => {
      const result = await addRecommendationComment(
        'apiUrl',
        'authToken',
        'accountApiKey',
        'some rec id',
        'some comment',
      );

      expect(result).toEqual('response');

      expect(createAnodotAuthHeadersMock).toHaveBeenCalledTimes(1);
      expect(createAnodotAuthHeadersMock).toHaveBeenCalledWith(
        'authToken',
        'accountApiKey',
      );

      expect(makeHttpRequestMock).toHaveBeenCalledTimes(1);
      expect(makeHttpRequestMock).toHaveBeenCalledWith(
        'POST',
        'apiUrl/v2/recommendations/some rec id/comments',
        'headers',
        { createdBy: 'OpenOps', comment: 'some comment' },
      );
    });
  });

  describe('update recommendation comment', () => {
    test('should call updateRecommendationComment with correct parameters', async () => {
      const result = await updateRecommendationComment(
        'apiUrl',
        'authToken',
        'accountApiKey',
        'some rec id',
        'some comment id',
        'new text',
      );

      expect(result).toEqual('response');

      expect(createAnodotAuthHeadersMock).toHaveBeenCalledTimes(1);
      expect(createAnodotAuthHeadersMock).toHaveBeenCalledWith(
        'authToken',
        'accountApiKey',
      );

      expect(makeHttpRequestMock).toHaveBeenCalledTimes(1);
      expect(makeHttpRequestMock).toHaveBeenCalledWith(
        'PUT',
        'apiUrl/v2/recommendations/some rec id/comments',
        'headers',
        { comment: 'new text', commentId: 'some comment id' },
      );
    });
  });

  describe('delete recommendation comment', () => {
    test('should call deleteRecommendationComment with correct parameters', async () => {
      const result = await deleteRecommendationComment(
        'apiUrl',
        'authToken',
        'accountApiKey',
        'some rec id',
        'some comment id',
      );

      expect(result).toEqual('response');

      expect(createAnodotAuthHeadersMock).toHaveBeenCalledTimes(1);
      expect(createAnodotAuthHeadersMock).toHaveBeenCalledWith(
        'authToken',
        'accountApiKey',
      );

      expect(makeHttpRequestMock).toHaveBeenCalledTimes(1);
      expect(makeHttpRequestMock).toHaveBeenCalledWith(
        'DELETE',
        'apiUrl/v2/recommendations/some rec id/comments',
        'headers',
        { commentId: 'some comment id' },
      );
    });
  });
});
