import { useFlowVersionUndoRedo } from '@/app/features/builder/flow-version-undo-redo/hooks/flow-version-undo-redo';
import { useEffect, useRef } from 'react';
import { useKeyboardFlowVersionUndoRedo } from './hooks/keyboard-history-shortcuts';

const UndoRedo = () => {
  const shouldClearUndoRedo = useRef(false);
  useKeyboardFlowVersionUndoRedo();
  const { clearUndoRedoHistory } = useFlowVersionUndoRedo();

  useEffect(() => {
    if (!shouldClearUndoRedo.current) {
      clearUndoRedoHistory();
      shouldClearUndoRedo.current = true;
    }
  }, [clearUndoRedoHistory]);
  return null;
};

UndoRedo.displayName = 'UndoRedo';
export { UndoRedo };
