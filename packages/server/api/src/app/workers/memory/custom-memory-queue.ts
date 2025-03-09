import { CustomSemaphore } from '@openops/server-shared';
import { assertNotNullOrUndefined, isNil } from '@openops/shared';
import cronParser from 'cron-parser';
import dayjs from 'dayjs';

export type CustomJob<T> = {
  data: T;
  id: string;
  cronExpression?: string;
  cronTimezone?: string;
  nextFireAtEpochSeconds?: number;
  failureCount?: number;
};

export class MemoryQueue<T> {
  private queue: CustomJob<T>[];
  private lock: CustomSemaphore;
  constructor() {
    this.lock = new CustomSemaphore(1);
    this.queue = [];
  }

  add(job: CustomJob<T>): void {
    if (isRecurringJob(job)) {
      this.queue.push(calculateNextJob(job));
    } else {
      this.queue.push(job);
    }
  }

  async remove(id: string): Promise<void> {
    await this.lock.acquire();
    this.queue = this.queue.filter((job) => job.id !== id);
    this.lock.release();
  }

  async poll(): Promise<CustomJob<T> | undefined> {
    try {
      await this.lock.acquire();
      const jobToRun = this.queue.findIndex(
        (job) =>
          isNil(job.nextFireAtEpochSeconds) ||
          dayjs().unix() >= Number(job.nextFireAtEpochSeconds),
      );
      if (jobToRun === -1) {
        return undefined;
      }
      const currentJob = this.queue.splice(jobToRun, 1)[0];
      if (isRecurringJob(currentJob)) {
        this.queue.push(calculateNextJob(currentJob));
      }
      return currentJob;
    } finally {
      this.lock.release();
    }
  }
}

function isRecurringJob<T>(job: CustomJob<T>): boolean {
  return job.cronExpression !== undefined;
}

function calculateNextJob<T>(job: CustomJob<T>): CustomJob<T> {
  assertNotNullOrUndefined(job.cronExpression, 'cronExpression');
  const nextFireAtEpochSeconds = calculateNextFireForCron(
    job.cronExpression,
    'UTC',
  );
  return {
    ...job,
    nextFireAtEpochSeconds,
  };
}

function calculateNextFireForCron(
  cronExpression: string,
  timezone: string,
): number {
  const interval = cronParser.parseExpression(cronExpression, {
    tz: timezone,
  });
  return dayjs(interval.next().getTime()).unix();
}
