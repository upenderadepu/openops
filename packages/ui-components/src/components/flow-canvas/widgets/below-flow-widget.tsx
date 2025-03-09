import { ViewportPortal } from '@xyflow/react';
import React from 'react';
import { OPS_NODE_SIZE } from '../../../lib/flow-canvas-utils';
import FlowEndWidget from './flow-end-widget';

const BelowFlowWidget = React.memo(
  ({ graphHeight }: { graphHeight: number }) => {
    return (
      <ViewportPortal>
        <div
          style={{
            transform: `translate(0px, ${graphHeight + 18}px)`,
            position: 'absolute',
            pointerEvents: 'auto',
          }}
        >
          <div
            className="flex items-center justify-center gap-2"
            style={{ width: OPS_NODE_SIZE.stepNode.width + 'px' }}
          >
            <FlowEndWidget></FlowEndWidget>
          </div>
        </div>
      </ViewportPortal>
    );
  },
);

BelowFlowWidget.displayName = 'BelowFlowWidget';
export { BelowFlowWidget };
