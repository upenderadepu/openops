import { AppSystemProp, QueueMode, system } from '@openops/server-shared';
import { memoryConsumer } from '../memory/memory-consumer';
import { redisConsumer } from '../redis/redis-consumer';

const systemMode = system.getOrThrow(AppSystemProp.QUEUE_MODE);
export const flowConsumer =
  systemMode == QueueMode.MEMORY ? memoryConsumer : redisConsumer;
