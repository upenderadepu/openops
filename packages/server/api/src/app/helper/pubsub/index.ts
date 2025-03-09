import {
  AppSystemProp,
  createRedisClient,
  QueueMode,
  system,
} from '@openops/server-shared';
import { isNil } from '@openops/shared';
import { memoryPubSub } from './memory-pubsub';
import { redisPubSub } from './redis-pubsub';

const queueMode = system.getOrThrow<QueueMode>(AppSystemProp.QUEUE_MODE);

let _pubsub: typeof memoryPubSub | null = null;

export const pubsub = () => {
  if (!isNil(_pubsub)) {
    return _pubsub;
  }

  _pubsub =
    queueMode === QueueMode.MEMORY
      ? memoryPubSub
      : redisPubSub(createRedisClient(), createRedisClient());

  return _pubsub;
};
