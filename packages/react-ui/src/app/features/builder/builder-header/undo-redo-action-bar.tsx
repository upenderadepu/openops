import {
  Redo,
  Undo,
  UndoRedoContainer,
  UndoRedoDevider,
} from '@openops/components/ui';

import { useFlowVersionUndoRedo } from '@/app/features/builder/flow-version-undo-redo/hooks/flow-version-undo-redo';

type UndoRedoActionBarProps = {
  className?: string;
};

const UndoRedoActionBar = ({ className }: UndoRedoActionBarProps) => {
  const { canRedo, canUndo, undo, redo } = useFlowVersionUndoRedo();
  return (
    <UndoRedoContainer className={className}>
      <Undo onClick={undo} disabled={!canUndo} />
      <UndoRedoDevider />
      <Redo onClick={redo} disabled={!canRedo} />
    </UndoRedoContainer>
  );
};

UndoRedoActionBar.displayName = 'UndoRedoActionBar';

export { UndoRedoActionBar };
export type { UndoRedoActionBarProps };
