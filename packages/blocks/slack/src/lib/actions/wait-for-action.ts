import { Property, Validators, createAction } from '@openops/blocks-framework';
import { ExecutionType } from '@openops/shared';
import { getMessageButtons } from '../common/actions-search';
import { slackAuth } from '../common/authentication';
import { getMessageObj, isMessageObj } from '../common/message-result';
import { timeoutInDays } from '../common/props';
import {
  onReceivedInteraction,
  waitForInteraction,
} from '../common/wait-for-interaction';

export const waitForAction = createAction({
  auth: slackAuth,
  name: 'wait_for_action',
  displayName: 'Wait For User Action',
  description: 'Wait for user action on the message.',
  props: {
    message: Property.LongText({
      displayName: 'Message',
      description: 'Slack message sent to the user.',
      required: true,
    }),

    actions: Property.MultiSelectDropdown({
      displayName: 'User Actions',
      description:
        'Actions available on the message. All buttons in the message will be listed here.',
      required: true,
      refreshers: ['message'],
      options: async ({ message }) => {
        if (!message || !isMessageObj(message)) {
          return {
            options: [],
            disabled: true,
          };
        }

        const options = getMessageButtons(message.response_body.message.blocks);

        return {
          disabled: false,
          options,
        };
      },
    }),
    timeoutInDays,
  },
  async run(context) {
    const { message, timeoutInDays, actions } = context.propsValue;
    const messageObj = getMessageObj(message);

    return context.executionType === ExecutionType.BEGIN
      ? await waitForInteraction(messageObj, timeoutInDays, context)
      : await onReceivedInteraction(messageObj, actions, context);
  },
});
