import {
  exceptionHandler,
  JobData,
  JobStatus,
  logger,
  OneTimeJobData,
  QueueName,
  rejectedPromiseHandler,
  RepeatingJobData,
  runWithLogContext,
  system,
  WebhookJobData,
  WorkerSystemProps,
} from '@openops/server-shared';
import { isNil } from '@openops/shared';
import { engineApiService, workerApiService } from './api/server-api.service';
import { flowJobExecutor } from './executors/flow-job-executor';
import { repeatingJobExecutor } from './executors/repeating-job-executor';
import { webhookExecutor } from './executors/webhook-job-executor';
import { jobPoller } from './job-polling';

const FLOW_WORKER_CONCURRENCY = system.getNumberOrThrow(
  WorkerSystemProps.FLOW_WORKER_CONCURRENCY,
);
const SCHEDULED_WORKER_CONCURRENCY = system.getNumberOrThrow(
  WorkerSystemProps.SCHEDULED_WORKER_CONCURRENCY,
);

let closed = true;
let workerToken: string;
let heartbeatInterval: NodeJS.Timeout;

export const flowWorker = {
  async init(generatedToken: string): Promise<void> {
    closed = false;
    workerToken = generatedToken;
    heartbeatInterval = setInterval(() => {
      rejectedPromiseHandler(workerApiService(workerToken).heartbeat());
    }, 60_000);
  },
  async start(): Promise<void> {
    let consumers = 0;
    for (const queueName of Object.values(QueueName)) {
      const times =
        queueName === QueueName.SCHEDULED
          ? SCHEDULED_WORKER_CONCURRENCY
          : FLOW_WORKER_CONCURRENCY;
      for (let i = 0; i < times; i++) {
        consumers++;
        rejectedPromiseHandler(run(queueName));
      }
    }
    logger.info(
      `Created ${consumers} consumers for ${
        Object.values(QueueName).length
      } queues`,
    );
  },
  async close(): Promise<void> {
    closed = true;
    clearTimeout(heartbeatInterval);
  },
};

async function run<T extends QueueName>(queueName: T): Promise<void> {
  while (!closed) {
    let engineToken: string | undefined;
    try {
      const job = await jobPoller.poll(workerToken, queueName);
      if (isNil(job)) {
        continue;
      }
      const { data, engineToken: jobEngineToken } = job;
      engineToken = jobEngineToken;
      await consumeJob(queueName, data, engineToken);
      await markJobAsCompleted(queueName, engineToken);
    } catch (e) {
      exceptionHandler.handle(e);
      if (engineToken) {
        rejectedPromiseHandler(
          engineApiService(engineToken).updateJobStatus({
            status: JobStatus.FAILED,
            queueName,
            message: (e as Error)?.message ?? 'Unknown error',
          }),
        );
      }
    }
  }
}

async function consumeJob(
  queueName: QueueName,
  jobData: JobData,
  engineToken: string,
): Promise<void> {
  switch (queueName) {
    case QueueName.ONE_TIME:
      // eslint-disable-next-line no-case-declarations
      const oneTimeJobData = jobData as OneTimeJobData;
      await runWithLogContext(
        {
          executionCorrelationId: oneTimeJobData.executionCorrelationId,
        },
        () => flowJobExecutor.executeFlow(oneTimeJobData, engineToken),
      );
      break;
    case QueueName.SCHEDULED:
      await repeatingJobExecutor.executeRepeatingJob({
        data: jobData as RepeatingJobData,
        engineToken,
        workerToken,
      });
      break;
    case QueueName.WEBHOOK: {
      await webhookExecutor.consumeWebhook(
        jobData as WebhookJobData,
        engineToken,
        workerToken,
      );
      break;
    }
  }
}

async function markJobAsCompleted(
  queueName: QueueName,
  engineToken: string,
): Promise<void> {
  switch (queueName) {
    case QueueName.ONE_TIME: {
      // This is will be marked as completed in update-run endpoint
      break;
    }
    case QueueName.SCHEDULED:
    case QueueName.WEBHOOK: {
      await engineApiService(engineToken).updateJobStatus({
        status: JobStatus.COMPLETED,
        queueName,
      });
    }
  }
}
