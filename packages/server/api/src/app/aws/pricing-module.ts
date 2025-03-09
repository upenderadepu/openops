import { Filter } from '@aws-sdk/client-pricing';
import {
  FastifyPluginAsyncTypebox,
  FastifyPluginCallbackTypebox,
} from '@fastify/type-provider-typebox';
import { SupportedPricingRegion } from '@openops/common';
import { FastifyRequest } from 'fastify';
import { GetPricingRequest } from './pricing-request';
import { getPrice } from './pricing-service';

export const pricingModule: FastifyPluginAsyncTypebox = async (app) => {
  await app.register(PricingController, { prefix: '/v1/pricing' });
};

const PricingController: FastifyPluginCallbackTypebox = (
  fastify,
  _opts,
  done,
) => {
  fastify.get(
    '/',
    { schema: { querystring: GetPricingRequest } },
    (request: FastifyRequest<{ Querystring: GetPricingRequest }>) => {
      return getPrice(
        request.query.serviceCode,
        JSON.parse(request.query.filters) as Filter[],
        request.query.region as unknown as SupportedPricingRegion,
      );
    },
  );
  done();
};
