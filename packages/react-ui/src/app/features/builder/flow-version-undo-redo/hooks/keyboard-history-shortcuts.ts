import { useEffect, useMemo } from 'react';

import { FLOW_CANVAS_CONTAINER_ID } from '../constants';
import {
  FlowVersionUndoRedo,
  useFlowVersionUndoRedo,
} from './flow-version-undo-redo';

const operationKeyboardKeyCombinationMap = {
  undo: [
    { key: 'z', modifiers: ['ctrlKey'], shortCircuitModifiers: ['shiftKey'] },
    { key: 'z', modifiers: ['metaKey'], shortCircuitModifiers: ['shiftKey'] },
  ],
  redo: [
    { key: 'z', modifiers: ['metaKey', 'shiftKey'] },
    { key: 'z', modifiers: ['ctrlKey', 'shiftKey'] },
    { key: 'y', modifiers: ['ctrlKey'] },
  ],
};

type OperationName = 'undo' | 'redo';

const operationToCapabilityMap: Record<
  OperationName,
  keyof Pick<FlowVersionUndoRedo, 'canRedo' | 'canUndo'>
> = {
  undo: 'canUndo',
  redo: 'canRedo',
};

function isModifierKey(key: string): key is keyof KeyboardEvent {
  return key in document.createEvent('KeyboardEvent');
}

const isKeyCombinationPressed = (
  e: KeyboardEvent,
  keyCombination: {
    key: string;
    modifiers: string[];
    shortCircuitModifiers?: string[];
  },
) => {
  const isKeyModifierPressed = (modifier: string) =>
    isModifierKey(modifier) && e[modifier];

  if (keyCombination.shortCircuitModifiers?.some(isKeyModifierPressed)) {
    return false;
  }

  return (
    keyCombination.modifiers.every(isKeyModifierPressed) &&
    e.key.toLowerCase() === keyCombination.key.toLowerCase()
  );
};

const useKeyboardHistoryShortcuts = (operationName: 'undo' | 'redo') => {
  const flowVersionUndoRedo = useFlowVersionUndoRedo();
  const operation = flowVersionUndoRedo[operationName];
  const combinations = useMemo(
    () => operationKeyboardKeyCombinationMap[operationName],
    [operationName],
  );

  useEffect(() => {
    const handleOperation = (e: KeyboardEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (
        target !== document.body &&
        !target.closest(`#${FLOW_CANVAS_CONTAINER_ID}`)
      ) {
        return;
      }

      const canPerformOperation =
        flowVersionUndoRedo[operationToCapabilityMap[operationName]];
      if (!canPerformOperation) {
        return;
      }

      if (
        combinations.every(
          (combination) => !isKeyCombinationPressed(e, combination),
        )
      ) {
        return;
      }

      e.preventDefault();
      operation();
    };

    window.addEventListener('keydown', handleOperation);
    return () => window.removeEventListener('keydown', handleOperation);
  }, [combinations, flowVersionUndoRedo, operation, operationName]);
};

const useKeyboardFlowVersionUndoRedo = () => {
  useKeyboardHistoryShortcuts('undo');
  useKeyboardHistoryShortcuts('redo');
};

export { useKeyboardFlowVersionUndoRedo, useKeyboardHistoryShortcuts };
