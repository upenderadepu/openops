import { NODE_WIDTH } from '@openops/components/ui';
import { useReactFlow } from '@xyflow/react';

const ANIMATION_DURATION = 600;

export const useCenterWorkflowViewOntoStep = () => {
  const { getNodes, setCenter } = useReactFlow();

  return (stepName: string) => {
    const node = getNodes().find((node) => node.id === stepName);

    if (node) {
      setCenter(node.position.x + NODE_WIDTH, node.position.y + NODE_WIDTH, {
        duration: ANIMATION_DURATION,
        zoom: 1,
      });
    }
  };
};
