const mockRedisInstance = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  on: jest.fn(),
};

jest.mock('../../src/lib/cache/redis-connection', () => ({
  createRedisClient: jest.fn().mockReturnValue(mockRedisInstance),
}));

import { redisWrapper } from '../../src/lib/cache/redis-wrapper';

describe('Redis Wrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setKey', () => {
    it('should set a key with default expiration', async () => {
      await redisWrapper.setKey('testKey', 'testValue');
      expect(mockRedisInstance.set).toHaveBeenCalledWith(
        'testKey',
        'testValue',
        'EX',
        60 * 60,
      );
    });

    it('should set a key with custom expiration', async () => {
      await redisWrapper.setKey('testKey', 'testValue', 120);
      expect(mockRedisInstance.set).toHaveBeenCalledWith(
        'testKey',
        'testValue',
        'EX',
        120,
      );
    });
  });

  describe('getKey', () => {
    it('should get a key value', async () => {
      mockRedisInstance.get.mockResolvedValue('testValue');
      const value = await redisWrapper.getKey('testKey');
      expect(value).toBe('testValue');
      expect(mockRedisInstance.get).toHaveBeenCalledWith('testKey');
    });

    it('should return null if key does not exist', async () => {
      mockRedisInstance.get.mockResolvedValue(null);
      const value = await redisWrapper.getKey('nonExistingKey');
      expect(value).toBeNull();
      expect(mockRedisInstance.get).toHaveBeenCalledWith('nonExistingKey');
    });
  });

  describe('deleteKey', () => {
    it('should delete a key', async () => {
      await redisWrapper.deleteKey('testKey');
      expect(mockRedisInstance.del).toHaveBeenCalledWith('testKey');
    });
  });

  describe('keyExists', () => {
    it('should return true if the key exists', async () => {
      mockRedisInstance.exists.mockResolvedValue(1);
      const exists = await redisWrapper.keyExists('testKey');
      expect(exists).toBe(true);
      expect(mockRedisInstance.exists).toHaveBeenCalledWith('testKey');
    });

    it('should return false if the key does not exist', async () => {
      mockRedisInstance.exists.mockResolvedValue(0);
      const exists = await redisWrapper.keyExists('nonExistingKey');
      expect(exists).toBe(false);
      expect(mockRedisInstance.exists).toHaveBeenCalledWith('nonExistingKey');
    });
  });

  describe('setSerializedObject', () => {
    it('should set a serialized object with default expiration', async () => {
      const obj = { name: 'Alice', age: 30 };
      await redisWrapper.setSerializedObject('testKey', obj);
      expect(mockRedisInstance.set).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(obj),
        'EX',
        60 * 60,
      );
    });

    it('should set a serialized object with custom expiration', async () => {
      const obj = { name: 'Alice', age: 30 };
      await redisWrapper.setSerializedObject('testKey', obj, 120);
      expect(mockRedisInstance.set).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(obj),
        'EX',
        120,
      );
    });
  });

  describe('getSerializedObject', () => {
    it('should retrieve and parse a serialized object', async () => {
      const obj = { name: 'Alice', age: 30 };
      mockRedisInstance.get.mockResolvedValue(JSON.stringify(obj));
      const result = await redisWrapper.getSerializedObject<{
        name: string;
        age: number;
      }>('testKey');
      expect(result).toEqual(obj);
      expect(mockRedisInstance.get).toHaveBeenCalledWith('testKey');
    });

    it('should return null if key does not exist', async () => {
      mockRedisInstance.get.mockResolvedValue(null);
      const result = await redisWrapper.getSerializedObject<{
        name: string;
        age: number;
      }>('nonExistingKey');
      expect(result).toBeNull();
      expect(mockRedisInstance.get).toHaveBeenCalledWith('nonExistingKey');
    });
  });
});
