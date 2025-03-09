import { t } from 'i18next';

import { Action, ActionType } from '@openops/shared';

export type RiskyStepConfirmationMessages = {
  warning: string;
  confirmationPrompt: string;
  confirmationAdvice?: string;
  confirmButtonText: string;
  cancelButtonText: string;
};

const TestRiskyStepConfirmationMessages: {
  GENERAL: RiskyStepConfirmationMessages;
  AWS: RiskyStepConfirmationMessages;
} = {
  GENERAL: {
    warning: t(
      'Warning. Executing this step may modify resources in your environment.',
    ),
    confirmationPrompt: t('Please review the details before proceeding.'),
    confirmButtonText: t('Understood, proceed'),
    cancelButtonText: t('Cancel'),
  },
  AWS: {
    warning: t('Action confirmation'),
    confirmationPrompt: t(
      'Executing this step may modify resources in your AWS environment. Are you sure you want to execute it?',
    ),
    confirmationAdvice: t(`To avoid changes, use the AWS dry run option.`),
    confirmButtonText: t('I understand, execute it'),
    cancelButtonText: t('Cancel'),
  },
};

export const getRiskyStepConfirmationMessagesForAction = (
  action: Action,
): RiskyStepConfirmationMessages => {
  if (
    action.type === ActionType.BLOCK &&
    action.settings.blockName.includes('block-aws')
  ) {
    return TestRiskyStepConfirmationMessages.AWS;
  }
  return TestRiskyStepConfirmationMessages.GENERAL;
};
