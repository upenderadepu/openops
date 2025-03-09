import { UndoRedoStackName } from '@/app/features/builder/flow-version-undo-redo/enums';

export const MAX_UNDO_REDO_SIZE = 10;
export const UNDO_ACTION = {
  from: UndoRedoStackName.UNDO,
  to: UndoRedoStackName.REDO,
};

export const REDO_ACTION = {
  from: UndoRedoStackName.REDO,
  to: UndoRedoStackName.UNDO,
};

export const FLOW_CANVAS_CONTAINER_ID = 'flow-canvas-container';
