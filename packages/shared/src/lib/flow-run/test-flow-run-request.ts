import { Static, Type } from '@sinclair/typebox';
import { OpenOpsId } from '../common/id-generator';
import { FlowRetryStrategy } from './flow-run';

export const TestFlowRunRequestBody = Type.Object({
  flowVersionId: OpenOpsId,
});

export type TestFlowRunRequestBody = Static<typeof TestFlowRunRequestBody>;

export const RetryFlowRequestBody = Type.Object({
  strategy: Type.Enum(FlowRetryStrategy),
});

export type RetryFlowRequestBody = Static<typeof RetryFlowRequestBody>;
