import { Static, Type } from '@sinclair/typebox';

export const WorkflowStats = Type.Object({
  activatedWorkflows: Type.Number(),
  totalWorkflows: Type.Number(),
  totalRuns: Type.Number(),
  successfulRuns: Type.Number(),
  failedRuns: Type.Number(),
});

export type WorkflowStats = Static<typeof WorkflowStats>;
