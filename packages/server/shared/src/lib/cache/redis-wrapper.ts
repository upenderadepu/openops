import Redis from 'ioredis';
import { logger } from '../logger';
import { createRedisClient } from './redis-connection';

let client: Redis | null = null;

// Default expire time is 1 hour
const DEFAULT_EXPIRE_TIME = 60 * 60;

const setKey = async (
  key: string,
  value: string,
  expireInSeconds: number = DEFAULT_EXPIRE_TIME,
): Promise<void> => {
  const redis = getRedisClient();
  await redis.set(key, value, 'EX', expireInSeconds);
};

const getKey = async (key: string): Promise<string | null> => {
  const redis = getRedisClient();
  return redis.get(key);
};

const deleteKey = async (key: string): Promise<void> => {
  const redis = getRedisClient();
  await redis.del(key);
};

const keyExists = async (key: string): Promise<boolean> => {
  const redis = getRedisClient();
  const result = await redis.exists(key);
  return result === 1;
};

async function setSerializedObject<T>(
  key: string,
  obj: T,
  expireInSeconds?: number,
): Promise<void> {
  await setKey(key, JSON.stringify(obj), expireInSeconds);
}

async function getSerializedObject<T>(key: string): Promise<T | null> {
  const result = await getKey(key);
  return result ? (JSON.parse(result) as T) : null;
}

const getRedisClient = (): Redis => {
  if (!client) {
    client = createRedisClient();

    client.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    client.on('end', () => {
      client = null;
    });
  }

  return client;
};

export const redisWrapper = {
  setKey,
  getKey,
  deleteKey,
  keyExists,
  setSerializedObject,
  getSerializedObject,
};
