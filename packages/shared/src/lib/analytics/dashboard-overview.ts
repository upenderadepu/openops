import { Static, Type } from '@sinclair/typebox';

export const DashboardOverview = Type.Object({
  unaddressedSavings: Type.Optional(Type.Number()),
  realizedSavings: Type.Optional(Type.Number()),
  openOpportunities: Type.Optional(Type.Number()),
  opportunitiesTableId: Type.Optional(Type.Number()),
});

export type DashboardOverview = Static<typeof DashboardOverview>;
