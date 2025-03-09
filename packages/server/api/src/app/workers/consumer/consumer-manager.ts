import { JobStatus, QueueJob, QueueName } from '@openops/server-shared';

export type ConsumerManager = {
  init(): Promise<void>;
  poll<T extends QueueName>(
    queueName: T,
    opts: Options,
  ): Promise<Omit<QueueJob, 'engineToken'> | null>;
  update(params: UpdateParams): Promise<void>;
  close(): Promise<void>;
};

type Options = {
  token: string;
};

type UpdateParams = {
  executionCorrelationId: string;
  queueName: QueueName;
  status: JobStatus;
  token: string;
  message: string;
};
