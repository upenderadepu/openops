import { ConfirmationDialog, ScrollArea } from '@openops/components/ui';
import { useCallback, useState } from 'react';

import { blocksHooks } from '@/app/features/blocks/lib/blocks-hook';
import { ExecuteRiskyFlowConfirmationMessage } from '@/app/features/flows/components/execute-risky-flow-dialog/execute-risky-flow-confirmation-message';
import { getRiskyActionFormattedNames } from '@/app/features/flows/components/execute-risky-flow-dialog/utils';
import { flowHelper, FlowVersion, RiskLevel } from '@openops/shared';

type ExecuteRiskyFlowDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  message: ExecuteRiskyFlowConfirmationMessage;
  riskyStepNames: string[];
  onConfirm: () => void;
  onCancel: () => void;
};

export const useExecuteRiskyFlowDialog = (
  flowVersion: FlowVersion,
  mutate: () => void,
) => {
  const { metadata, isLoading } = blocksHooks.useAllStepsMetadata({
    searchQuery: '',
    type: 'action',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [riskyStepNames, setRiskyStepNames] = useState<string[]>([]);

  const handleExecuting = useCallback(
    (riskLevel: RiskLevel = RiskLevel.HIGH) => {
      const allSteps = flowHelper.getAllSteps(flowVersion.trigger);

      const riskyStepsFormattedNames = getRiskyActionFormattedNames(
        allSteps,
        metadata,
        riskLevel,
      );

      if (riskyStepsFormattedNames.length) {
        setRiskyStepNames(riskyStepsFormattedNames);
        setIsDialogOpen(true);
      } else {
        mutate();
      }
    },
    [flowVersion, metadata, mutate],
  );

  const handleExecutingConfirm = () => {
    setIsDialogOpen(false);
    mutate();
  };

  const handleExecutingCancel = () => {
    setIsDialogOpen(false);
    setRiskyStepNames([]);
  };

  return {
    isDialogOpen,
    riskyStepNames,
    isLoading,
    handleExecuting,
    handleExecutingConfirm,
    handleExecutingCancel,
    setIsDialogOpen,
  };
};

const ExecuteRiskyFlowDialog = ({
  isOpen,
  onOpenChange,
  message,
  riskyStepNames,
  onConfirm,
  onCancel,
}: ExecuteRiskyFlowDialogProps) => {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={message.title}
      description={message.description}
      confirmButtonText={message.confirmButtonText}
      cancelButtonText={message.cancelButtonText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      titleClassName={'text-destructive'}
      descriptionClassName={'text-base text-gray-700 dark:text-gray-100'}
    >
      {riskyStepNames.length && (
        <div className="text-gray-700  dark:text-gray-100">
          <span className="text-base">{message.additionalText}</span>
          <ScrollArea>
            <ul className="list-disc list-inside mt-2 max-h-[20vh]">
              {riskyStepNames.map((name, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700  dark:text-gray-100"
                >
                  {name}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </ConfirmationDialog>
  );
};

export { ExecuteRiskyFlowDialog };
