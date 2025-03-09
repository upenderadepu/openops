import { t } from 'i18next';
import { useEffect, useRef } from 'react';

import { blocksHooks } from '@/app/features/blocks/lib/blocks-hook';
import { Action, Trigger } from '@openops/shared';

type StepDragTemplateProps = {
  step: Action | Trigger;
};

const STEP_DRAG_OVERLAY_SIZE = 100;

const StepDragOverlay = ({ step }: StepDragTemplateProps) => {
  const shadowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (shadowRef.current) {
        shadowRef.current.style.left = `${
          event.clientX - STEP_DRAG_OVERLAY_SIZE / 2
        }px`;
        shadowRef.current.style.top = `${
          event.clientY - STEP_DRAG_OVERLAY_SIZE / 2
        }px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const { stepMetadata } = blocksHooks.useStepMetadata({
    step: step!,
  });

  return (
    <div
      className="p-4 absolute left-0 top-0  opacity-75 flex items-center justify-center rounded-lg border-solid border bg-white"
      style={{
        height: `${STEP_DRAG_OVERLAY_SIZE}px`,
        width: `${STEP_DRAG_OVERLAY_SIZE}px`,
      }}
      ref={shadowRef}
    >
      <img
        id={t('logo')}
        className={'object-contain left-0 right-0 static'}
        src={stepMetadata?.logoUrl}
        alt={t('Step Icon')}
      />
    </div>
  );
};

export default StepDragOverlay;
