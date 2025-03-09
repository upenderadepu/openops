/**
 * Undo-Redo Stack Management for Flow Builder
 *
 * This module provides a utility to manage undo and redo stacks for Flow Builder state changes.
 * It uses `localforage` for persistent storage and ensures proper management of undo/redo actions
 * with stack size limitations, metadata tracking, and automatic pointer updates.
 *
 * Key Components:
 * 1. **Metadata Management**: Maintains stack pointers (top/bottom) for UNDO and REDO operations.
 *    - The **top pointer** marks the position of the last element in the stack.
 *    - The **bottom pointer** marks one step back from the first element in the stack, effectively
 *      tracking the position before the first valid entry.
 *    - When stacks are empty, pointers are reset to `0`.
 * 2. **Stack Size Control**: Ensures the stack size does not exceed the `MAX_UNDO_REDO_SIZE`.
 *    - If the size exceeds the limit, the oldest item is removed (bottom pointer incremented).
 * 3. **Undo/Redo Actions**: Provides utilities for adding new actions, clearing redo history,
 *    bulk-moving multiple actions, and checking stack emptiness to enable or disable functionality.
 * 4. **Persistent Storage**: Stores both metadata and individual history items in `localforage`.
 *    - Keys are dynamically generated based on the action ID and pointer values.
 * 5. **Reinitialization**: Allows the entire undo-redo system to be cleared and reinitialized.
 *
 * Workflow:
 * - Actions are added to the UNDO stack using `addToUndo()`.
 * - When new actions are added, the REDO stack is cleared to maintain consistency.
 * - Metadata is frequently updated to reflect the current state of the stacks.
 * - Helper functions like `disableStacksIfEmpty` ensure UI consistency by enabling or disabling
 *   undo/redo buttons based on stack state.
 *
 */

import { FlowVersion } from '@openops/shared';
import localforage from 'localforage';
import { useBuilderStateContext } from '../../builder-hooks';
import { MAX_UNDO_REDO_SIZE } from '../constants';
import { PointerName, UndoRedoStackName } from '../enums';
import {
  FlowVersionUndoRedoHistoryItem,
  MoveActionType,
  UndoRedoMetaData,
} from '../types';
import { createKey, processMoveAction } from './utils';

localforage.config({
  name: 'undo-redo',
  storeName: 'undoRedoStore',
});

const METADATA_KEY = 'metadata';
const INITIAL_METADATA = {
  [PointerName.UNDO_TOP]: 0,
  [PointerName.UNDO_BOTTOM]: 0,
  [PointerName.REDO_TOP]: 0,
  [PointerName.REDO_BOTTOM]: 0,
};

const initializeUndoRedoDB = async () => {
  const metadata = await localforage.getItem<UndoRedoMetaData>(METADATA_KEY);
  if (!metadata) {
    await localforage.setItem(METADATA_KEY, INITIAL_METADATA);
  }
};

const useUndoRedoDB = (flowId: string) => {
  const [setCanUndo, setCanRedo] = useBuilderStateContext((state) => [
    state.setCanUndo,
    state.setCanRedo,
  ]);

  const disableStacksIfEmpty = async (updatedMetadata?: UndoRedoMetaData) => {
    const metadata = {
      ...INITIAL_METADATA,
      ...(updatedMetadata || {}),
    };

    // Check if the UNDO stack is empty by comparing top and bottom pointers
    const isUndoEmpty =
      metadata[PointerName.UNDO_TOP] === metadata[PointerName.UNDO_BOTTOM];

    // Check if the REDO stack is empty by comparing top and bottom pointers
    const isRedoEmpty =
      metadata[PointerName.REDO_TOP] === metadata[PointerName.REDO_BOTTOM];

    setCanUndo(!isUndoEmpty);
    setCanRedo(!isRedoEmpty);

    if (isUndoEmpty) {
      // Reset UNDO pointers when the stack is empty
      metadata[PointerName.UNDO_TOP] = 0;
      metadata[PointerName.UNDO_BOTTOM] = 0;
    }

    if (isRedoEmpty) {
      // Reset REDO pointers when the stack is empty
      metadata[PointerName.REDO_TOP] = 0;
      metadata[PointerName.REDO_BOTTOM] = 0;
    }

    if (isUndoEmpty || isRedoEmpty) {
      await localforage.setItem(METADATA_KEY, metadata);
    }
  };

  const addToUndo = async (
    flowVersionHistoryItem: FlowVersionUndoRedoHistoryItem,
  ) => {
    setCanRedo(false);

    const metadata =
      (await localforage.getItem<UndoRedoMetaData>(METADATA_KEY)) ||
      INITIAL_METADATA;

    // Check if the stack size has reached the maximum allowed limit
    // Difference between top and bottom indicates stack size
    if (
      metadata[PointerName.UNDO_TOP] - metadata[PointerName.UNDO_BOTTOM] >=
      MAX_UNDO_REDO_SIZE
    ) {
      // Move the bottom pointer up by one to make room for a new item
      metadata[PointerName.UNDO_BOTTOM]++;
      // Remove the oldest element from storage
      await localforage.removeItem(
        createKey(
          UndoRedoStackName.UNDO,
          flowId,
          metadata[PointerName.UNDO_BOTTOM],
        ),
      );
    }
    // Move the top pointer up by one to add a new item
    metadata[PointerName.UNDO_TOP]++;
    await localforage.setItem(
      createKey(UndoRedoStackName.UNDO, flowId, metadata[PointerName.UNDO_TOP]),
      flowVersionHistoryItem,
    );

    await localforage.setItem(METADATA_KEY, {
      ...INITIAL_METADATA,
      ...metadata,
    });

    setCanUndo(true);
    await clearRedo(flowId);
  };

  const clearRedo = async (flowVersionHistoryItemId: string): Promise<void> => {
    setCanRedo(false);
    const metadata =
      (await localforage.getItem<UndoRedoMetaData>(METADATA_KEY)) ||
      INITIAL_METADATA;

    // Remove all items in the REDO stack
    for (
      let i = (metadata[PointerName.REDO_BOTTOM] || 0) + 1; // Start at the bottom + 1
      i <= (metadata[PointerName.REDO_TOP] || 0); // Go up to the top pointer
      i++
    ) {
      await localforage.removeItem(
        createKey(UndoRedoStackName.REDO, flowVersionHistoryItemId, i),
      );
    }

    // Reset both top and bottom pointers of the REDO stack
    metadata[PointerName.REDO_TOP] = metadata[PointerName.REDO_BOTTOM] = 0;
    await localforage.setItem(METADATA_KEY, {
      ...INITIAL_METADATA,
      ...metadata,
    });
  };

  const bulkMoveAction = async (
    moveActions: MoveActionType[],
    lastFlowVersion: FlowVersion,
  ): Promise<FlowVersionUndoRedoHistoryItem | undefined> => {
    let lastHistoryItem: FlowVersionUndoRedoHistoryItem = {
      snapshot: lastFlowVersion.trigger,
      id: lastFlowVersion.id,
      spotlightStepName: '',
    };

    let metadata =
      (await localforage.getItem<UndoRedoMetaData>(METADATA_KEY)) ||
      INITIAL_METADATA;

    // Do nothing if all pointers are 0, meaning both stacks are empty
    if (Object.values(metadata).every((pointer) => pointer === 0)) {
      return;
    }

    for (const moveAction of moveActions) {
      const result = await processMoveAction(
        moveAction,
        metadata,
        lastHistoryItem,
        flowId,
      );
      metadata = result.metadata;
      lastHistoryItem = result.lastHistoryItem;
    }

    const updatedMetadata = {
      ...INITIAL_METADATA,
      ...metadata,
    };

    await localforage.setItem(METADATA_KEY, updatedMetadata);

    await disableStacksIfEmpty(updatedMetadata);

    return lastHistoryItem;
  };

  const clearUndoRedoDB = async (): Promise<void> => {
    await localforage.clear();
    await initializeUndoRedoDB();
    await disableStacksIfEmpty();
  };

  return {
    initializeUndoRedoDB,
    addToUndo,
    bulkMoveAction,
    clearUndoRedoDB,
  };
};

export { useUndoRedoDB };
