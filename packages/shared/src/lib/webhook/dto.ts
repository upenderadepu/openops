import { Static, Type } from '@sinclair/typebox';
import { OpenOpsId } from '../common/id-generator';

export const WebhookUrlParams = Type.Object({
  flowId: OpenOpsId,
});

export type WebhookUrlParams = Static<typeof WebhookUrlParams>;
