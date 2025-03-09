import { Static, Type } from '@sinclair/typebox';
import { OpenOpsId } from '../common/id-generator';

export enum TriggerTestStrategy {
  SIMULATION = 'SIMULATION',
  TEST_FUNCTION = 'TEST_FUNCTION',
}

export const TestTriggerRequestBody = Type.Object({
  flowId: OpenOpsId,
  flowVersionId: OpenOpsId,
  testStrategy: Type.Enum(TriggerTestStrategy),
});

export type TestTriggerRequestBody = Static<typeof TestTriggerRequestBody>;
