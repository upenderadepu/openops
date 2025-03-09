import { blocksHooks } from '@/app/features/blocks/lib/blocks-hook';
import { TemplateStepNode, WorkflowNode } from '@openops/components/ui';
import React from 'react';

const TemplateStepNodeWithMetadata = React.memo(
  ({ data }: { data: WorkflowNode['data'] }) => {
    const { stepMetadata } = blocksHooks.useStepMetadata({
      step: data.step,
    });

    return (
      <TemplateStepNode
        stepName={data.step?.name}
        stepMetadata={stepMetadata}
      />
    );
  },
);

TemplateStepNodeWithMetadata.displayName = 'TemplateStepNodeWithMetadata';
export { TemplateStepNodeWithMetadata };
