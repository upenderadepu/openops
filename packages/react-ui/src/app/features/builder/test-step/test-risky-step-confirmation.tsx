import { Button } from '@openops/components/ui';
import { Info } from 'lucide-react';

import { RiskyStepConfirmationMessages } from '@/app/features/builder/test-step/test-risky-step-confirmation-messages';

type TestRiskyStepConfirmationProps = {
  onConfirm: () => void;
  onCancel: () => void;
  confirmationMessage: RiskyStepConfirmationMessages;
};

const TestRiskyStepConfirmation = ({
  onConfirm,
  onCancel,
  confirmationMessage,
}: TestRiskyStepConfirmationProps) => {
  return (
    <div className="flex flex-col p-5 border rounded-lg">
      <h3 className="text-destructive font-semibold mb-2">
        {confirmationMessage.warning}
      </h3>
      <p>{confirmationMessage.confirmationPrompt}</p>
      <div className="flex gap-4 items-center mt-3">
        <Info></Info>
        <p>{confirmationMessage.confirmationAdvice}</p>
      </div>
      <div className="flex self-end gap-3 mt-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          {confirmationMessage.cancelButtonText}
        </Button>
        <Button variant="default" size="sm" onClick={onConfirm}>
          {confirmationMessage.confirmButtonText}
        </Button>
      </div>
    </div>
  );
};

TestRiskyStepConfirmation.displayName = 'TestRiskyStepConfirmation';
export { TestRiskyStepConfirmation };
