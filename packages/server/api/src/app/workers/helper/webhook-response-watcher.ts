import { AppSystemProp, logger, system } from '@openops/server-shared';
import { EngineHttpResponse, openOpsId } from '@openops/shared';
import { StatusCodes } from 'http-status-codes';
import { pubsub } from '../../helper/pubsub';

const listeners = new Map<
  string,
  (flowResponse: EngineResponseWithId) => void
>();
const WEBHOOK_TIMEOUT_MS =
  (system.getNumber(AppSystemProp.WEBHOOK_TIMEOUT_SECONDS) ?? 30) * 1000;
const SERVER_ID = openOpsId();

export const webhookResponseWatcher = {
  getServerId(): string {
    return SERVER_ID;
  },
  async init(): Promise<void> {
    logger.info('[engineWatcher#init] Initializing engine run watcher');
    await pubsub().subscribe(
      `engine-run:sync:${SERVER_ID}`,
      (_channel, message) => {
        const parsedMessage: EngineResponseWithId = JSON.parse(message);
        const listener = listeners.get(parsedMessage.executionCorrelationId);
        if (listener) {
          listener(parsedMessage);
        }
        logger.info(
          { executionCorrelationId: parsedMessage.executionCorrelationId },
          '[engineWatcher#init]',
        );
      },
    );
  },
  async oneTimeListener(
    executionCorrelationId: string,
    timeoutRequest: boolean,
  ): Promise<EngineHttpResponse> {
    logger.info({ executionCorrelationId }, '[engineWatcher#listen]');
    return new Promise((resolve) => {
      let timeout: NodeJS.Timeout;
      if (timeoutRequest) {
        const defaultResponse: EngineHttpResponse = {
          status: StatusCodes.NO_CONTENT,
          body: {},
          headers: {},
        };
        timeout = setTimeout(() => {
          listeners.delete(executionCorrelationId);
          resolve(defaultResponse);
        }, WEBHOOK_TIMEOUT_MS);
      }
      const responseHandler = (flowResponse: EngineResponseWithId) => {
        if (timeout) {
          clearTimeout(timeout);
        }
        listeners.delete(executionCorrelationId);
        resolve(flowResponse.httpResponse);
      };
      listeners.set(executionCorrelationId, responseHandler);
    });
  },
  async publish(
    executionCorrelationId: string,
    workerServerId: string,
    httpResponse: EngineHttpResponse,
  ): Promise<void> {
    logger.info({ executionCorrelationId }, '[engineWatcher#publish]');
    const message: EngineResponseWithId = {
      executionCorrelationId,
      httpResponse,
    };
    await pubsub().publish(
      `engine-run:sync:${workerServerId}`,
      JSON.stringify(message),
    );
  },
  async shutdown(): Promise<void> {
    await pubsub().unsubscribe(`engine-run:sync:${SERVER_ID}`);
  },
};

export type EngineResponseWithId = {
  executionCorrelationId: string;
  httpResponse: EngineHttpResponse;
};
