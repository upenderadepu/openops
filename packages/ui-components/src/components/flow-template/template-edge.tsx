import { StepLocationRelativeToParent } from '@openops/shared';
import { BaseEdge, useNodes } from '@xyflow/react';
import { t } from 'i18next';
import React from 'react';
import {
  EdgePath,
  getEdgePath,
  getLengthMultiplier,
  getPositionRelativeToParent,
  LINE_WIDTH,
} from '../../lib/flow-canvas-utils';
import { BranchLabel } from '../flow-canvas/edges/branch-label';
import { getSplitEdgeData } from '../flow-canvas/edges/utils';

const TemplateEdge = React.memo((props: EdgePath) => {
  const nodes = useNodes();

  const { isInsideSplit, isInsideBranch, isInsideLoop } =
    getPositionRelativeToParent(props.data.stepLocationRelativeToParent);
  const lengthMultiplier = getLengthMultiplier({
    isInsideBranch,
    isInsideSplit,
    isInsideLoop,
  });

  const { edgePath, buttonPosition } = getEdgePath({
    ...props,
    lengthMultiplier,
  });

  return (
    <>
      <BaseEdge
        interactionWidth={0}
        path={edgePath}
        style={{ strokeWidth: `${LINE_WIDTH}px` }}
        className="cursor-default !stroke-greyBlue"
      />

      {isInsideBranch && (
        <BranchLabel
          branchName={
            props.data.stepLocationRelativeToParent ===
            StepLocationRelativeToParent.INSIDE_TRUE_BRANCH
              ? t('True')
              : t('False')
          }
          isDefaultBranch={false}
          buttonPosition={buttonPosition}
        />
      )}
      {isInsideSplit && (
        <BranchLabel
          {...getSplitEdgeData(props.source, props.target, nodes)}
          buttonPosition={buttonPosition}
        />
      )}
    </>
  );
});

TemplateEdge.displayName = 'TemplateEdge';
export { TemplateEdge };
