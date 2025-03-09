import { ConfirmationDialogContent } from '@openops/components/ui';
import { t } from 'i18next';

export type ExecuteRiskyFlowConfirmationMessage = ConfirmationDialogContent & {
  additionalText: string;
};

export const ExecuteRiskyFlowConfirmationMessages: {
  GENERAL: ExecuteRiskyFlowConfirmationMessage;
} = {
  GENERAL: {
    title: t('Action confirmation'),
    description: t(
      'Executing this workflow may modify resources in your  environment.',
    ),
    additionalText: t(
      'Please review the upcoming actions and confirm if you wish to proceed: ',
    ),
    confirmButtonText: t('I understand, execute it'),
    cancelButtonText: t('Cancel'),
  },
};
