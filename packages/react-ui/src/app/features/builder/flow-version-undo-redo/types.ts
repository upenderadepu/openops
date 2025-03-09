import { FlowVersion, Trigger } from '@openops/shared';
import { REDO_ACTION, UNDO_ACTION } from './constants';
import { PointerName } from './enums';

export type FlowVersionUndoRedoHistoryItem = {
  snapshot: Trigger;
  spotlightStepName: string;
} & Pick<FlowVersion, 'id'>;

export type MoveActionType = typeof UNDO_ACTION | typeof REDO_ACTION;

export type UndoRedoMetaData = {
  [PointerName.UNDO_TOP]: number;
  [PointerName.UNDO_BOTTOM]: number;
  [PointerName.REDO_TOP]: number;
  [PointerName.REDO_BOTTOM]: number;
};
