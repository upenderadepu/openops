import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  GenerateHttpRequestBodyRequest,
  GenerateHttpRequestBodyResponse,
  WebsocketClientEvent,
  WebsocketServerEvent,
} from '@openops/shared';
import { websocketService } from '../../websockets/websockets.service';
import { requestWriterService } from './request-writer.service';

export const requestWriterModule: FastifyPluginAsyncTypebox = async () => {
  websocketService.addListener(
    WebsocketServerEvent.GENERATE_HTTP_REQUEST,
    (socket) => {
      return async (data: GenerateHttpRequestBodyRequest) => {
        const { prompt } = data;
        const result = await requestWriterService.createRequest({ prompt });
        const response: GenerateHttpRequestBodyResponse = {
          result,
        };

        socket.emit(
          WebsocketClientEvent.GENERATE_HTTP_REQUEST_FINISHED,
          response,
        );
      };
    },
  );
};
