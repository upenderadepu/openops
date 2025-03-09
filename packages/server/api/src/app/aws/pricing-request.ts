import { Static, Type } from '@sinclair/typebox';

export const GetPricingRequest = Type.Object({
  serviceCode: Type.String(),
  filters: Type.String(),
  region: Type.String(),
});

export type GetPricingRequest = Static<typeof GetPricingRequest>;
