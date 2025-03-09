import { logger } from '@openops/server-shared';
import axios, { AxiosError, AxiosHeaders, Method } from 'axios';

export async function makeHttpRequest<T>(
  method: Method,
  url: string,
  headers?: AxiosHeaders,
  body?: any,
): Promise<T> {
  try {
    const config = {
      data: body,
      headers,
      method,
      url,
    };

    const response = await axios(config);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const logMessage = `Error making HTTP request. Url: "${url}"`;

    if (axiosError && axiosError.response?.data) {
      logger.error(logMessage, {
        ...axiosError.response?.data,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
      });

      throw new Error(JSON.stringify(axiosError.response?.data));
    }

    logger.error(logMessage, error);
    throw error;
  }
}
