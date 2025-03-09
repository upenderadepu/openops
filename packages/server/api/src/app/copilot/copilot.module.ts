import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { logger } from '@openops/server-shared';
import {
  GenerateCodeRequest,
  GenerateCodeResponse,
  WebsocketClientEvent,
  WebsocketServerEvent,
} from '@openops/shared';
import { websocketService } from '../websockets/websockets.service';
import { copilotService } from './copilot.service';

export const copilotModule: FastifyPluginAsyncTypebox = async () => {
  websocketService.addListener(WebsocketServerEvent.GENERATE_CODE, (socket) => {
    return async (data: GenerateCodeRequest) => {
      try {
        const { prompt, previousContext } = data;
        const response: GenerateCodeResponse =
          await copilotService.generateCode({ prompt, previousContext });
        socket.emit(WebsocketClientEvent.GENERATE_CODE_FINISHED, response);
      } catch (err) {
        logger.error(
          'Something went wrong when handling the GENERATE_CODE event.',
          {
            message: (err as Error).message,
          },
        );
        socket.emit('error', {
          success: false,
          output: (err as Error).message,
        });
      }
    };
  });
};
