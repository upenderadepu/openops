import {
  Background,
  EdgeTypes,
  NodeTypes,
  ReactFlow,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { ReactNode, useCallback, useRef } from 'react';
import { Graph } from '../../lib/flow-canvas-utils';
import { useResizeCanvas } from './use-resize-canvas';

type FlowCanvasProps = {
  edgeTypes?: EdgeTypes;
  nodeTypes?: NodeTypes;
  graph?: Graph;
  topOffset?: number;
  allowCanvasPanning?: boolean;
  children?: ReactNode;
};

const FlowCanvas = React.memo(
  ({
    edgeTypes,
    nodeTypes,
    graph,
    topOffset,
    allowCanvasPanning = true,
    children,
  }: FlowCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useResizeCanvas(containerRef);

    const onInit = useCallback(
      (reactFlow: ReactFlowInstance) => {
        reactFlow.fitView({
          nodes: reactFlow.getNodes().slice(0, 5),
          minZoom: 0.5,
          maxZoom: 1.2,
        });
        if (topOffset) {
          const { x, zoom } = reactFlow.getViewport();
          reactFlow.setViewport({ x, y: topOffset, zoom });
        }
      },
      [topOffset],
    );

    return (
      <div className="size-full bg-editorBackground" ref={containerRef}>
        {!!graph && (
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={graph.nodes}
            edgeTypes={edgeTypes}
            edges={graph.edges}
            draggable={false}
            edgesFocusable={false}
            elevateEdgesOnSelect={false}
            maxZoom={1.5}
            minZoom={0.5}
            panOnDrag={allowCanvasPanning}
            zoomOnDoubleClick={false}
            panOnScroll={true}
            fitView={false}
            nodesConnectable={false}
            elementsSelectable={true}
            nodesDraggable={false}
            nodesFocusable={false}
            proOptions={{
              hideAttribution: true,
            }}
            onInit={onInit}
          >
            <Background color="lightgray" />
            {children}
          </ReactFlow>
        )}
      </div>
    );
  },
);

FlowCanvas.displayName = 'FlowCanvas';
export { FlowCanvas, FlowCanvasProps };
