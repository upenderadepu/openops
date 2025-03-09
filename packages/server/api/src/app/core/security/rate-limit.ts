import RateLimitPlugin from '@fastify/rate-limit';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  AppSystemProp,
  createRedisClient,
  networkUtls,
  QueueMode,
  system,
} from '@openops/server-shared';
import FastifyPlugin from 'fastify-plugin';
import { Redis } from 'ioredis';

const API_RATE_LIMIT_AUTHN_ENABLED = system.getBoolean(
  AppSystemProp.API_RATE_LIMIT_AUTHN_ENABLED,
);

export const rateLimitModule: FastifyPluginAsyncTypebox = FastifyPlugin(
  async (app) => {
    if (API_RATE_LIMIT_AUTHN_ENABLED) {
      await app.register(RateLimitPlugin, {
        global: false,
        keyGenerator: networkUtls.extractClientRealIp,
        redis: getRedisClient(),
      });
    }
  },
);

const getRedisClient = (): Redis | undefined => {
  const redisIsNotConfigured =
    system.get<QueueMode>(AppSystemProp.QUEUE_MODE) !== QueueMode.REDIS;

  if (redisIsNotConfigured) {
    return undefined;
  }

  return createRedisClient({
    connectTimeout: 500,
    maxRetriesPerRequest: 1,
  });
};
