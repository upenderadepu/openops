import { Trigger } from '@openops/shared';
import localforage from 'localforage';
import { PointerName, UndoRedoStackName } from '../../enums';
import { FlowVersionUndoRedoHistoryItem } from '../../types';
import { createKey, processMoveAction } from '../utils';

jest.mock('../undo-redo-db', () => ({
  PointerName: {
    UNDO_TOP: 'UNDO_TOP',
    UNDO_BOTTOM: 'UNDO_BOTTOM',
    REDO_TOP: 'REDO_TOP',
    REDO_BOTTOM: 'REDO_BOTTOM',
  },
  UndoRedoStackName: {
    UNDO: 'undo',
    REDO: 'redo',
  },
}));

jest.mock('localforage');

const mockLocalforage = localforage as jest.Mocked<typeof localforage>;

describe('processMoveAction', () => {
  const mockHistoryItem: FlowVersionUndoRedoHistoryItem = {
    id: '123',
    snapshot: { displayName: 'trigger' } as Trigger,
    spotlightStepName: 'step',
  };

  const flowId = 'flowId';

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalforage.getItem.mockResolvedValue(null);
    mockLocalforage.setItem.mockResolvedValue(undefined);
    mockLocalforage.removeItem.mockResolvedValue(undefined);
  });

  it('should skip processing if the source stack is empty', async () => {
    const metadata = {
      [PointerName.UNDO_TOP]: 0,
      [PointerName.UNDO_BOTTOM]: 0,
      [PointerName.REDO_TOP]: 0,
      [PointerName.REDO_BOTTOM]: 0,
    };

    const result = await processMoveAction(
      { from: UndoRedoStackName.UNDO, to: UndoRedoStackName.REDO },
      metadata,
      mockHistoryItem,
      flowId,
    );

    expect(result).toEqual({ metadata, lastHistoryItem: mockHistoryItem });
    expect(mockLocalforage.getItem).not.toHaveBeenCalled();
    expect(mockLocalforage.setItem).not.toHaveBeenCalled();
    expect(mockLocalforage.removeItem).not.toHaveBeenCalled();
  });

  it('should move an item from undo to redo stack', async () => {
    const metadata = {
      [PointerName.UNDO_TOP]: 1,
      [PointerName.UNDO_BOTTOM]: 0,
      [PointerName.REDO_TOP]: 0,
      [PointerName.REDO_BOTTOM]: 0,
    };

    const mockOperation: FlowVersionUndoRedoHistoryItem = {
      id: '123',
      snapshot: { displayName: 'trigger' } as Trigger,
      spotlightStepName: 'step2',
    };

    mockLocalforage.getItem.mockResolvedValueOnce(mockOperation);

    const result = await processMoveAction(
      { from: UndoRedoStackName.UNDO, to: UndoRedoStackName.REDO },
      metadata,
      mockHistoryItem,
      flowId,
    );

    expect(mockLocalforage.getItem).toHaveBeenCalledWith(`undo-${flowId}-1`);
    expect(mockLocalforage.removeItem).toHaveBeenCalledWith(`undo-${flowId}-1`);
    expect(mockLocalforage.setItem).toHaveBeenCalledWith(
      `redo-${flowId}-1`,
      expect.objectContaining({ spotlightStepName: 'step2' }),
    );

    expect(result.metadata).toEqual({
      [PointerName.UNDO_TOP]: 0,
      [PointerName.UNDO_BOTTOM]: 0,
      [PointerName.REDO_TOP]: 1,
      [PointerName.REDO_BOTTOM]: 0,
    });

    expect(result.lastHistoryItem).toEqual({
      id: '123',
      snapshot: { displayName: 'trigger' },
      spotlightStepName: 'step2',
    });
  });

  it('should move an item from redo to undo stack', async () => {
    const metadata = {
      [PointerName.UNDO_TOP]: 0,
      [PointerName.UNDO_BOTTOM]: 0,
      [PointerName.REDO_TOP]: 1,
      [PointerName.REDO_BOTTOM]: 0,
    };

    const mockOperation: FlowVersionUndoRedoHistoryItem = {
      id: '123',
      snapshot: { displayName: 'trigger2' } as Trigger,
      spotlightStepName: 'step3',
    };

    mockLocalforage.getItem.mockResolvedValueOnce(mockOperation);

    const result = await processMoveAction(
      { from: UndoRedoStackName.REDO, to: UndoRedoStackName.UNDO },
      metadata,
      mockHistoryItem,
      flowId,
    );

    expect(mockLocalforage.getItem).toHaveBeenCalledWith(`redo-${flowId}-1`);
    expect(mockLocalforage.removeItem).toHaveBeenCalledWith(`redo-${flowId}-1`);
    expect(mockLocalforage.setItem).toHaveBeenCalledWith(
      `undo-${flowId}-1`,
      expect.objectContaining({ spotlightStepName: 'step3' }),
    );

    expect(result.metadata).toEqual({
      [PointerName.UNDO_TOP]: 1,
      [PointerName.UNDO_BOTTOM]: 0,
      [PointerName.REDO_TOP]: 0,
      [PointerName.REDO_BOTTOM]: 0,
    });

    expect(result.lastHistoryItem).toEqual({
      id: '123',
      snapshot: { displayName: 'trigger2' },
      spotlightStepName: 'step3',
    });
  });

  it('should handle missing operation gracefully', async () => {
    const metadata = {
      [PointerName.UNDO_TOP]: 1,
      [PointerName.UNDO_BOTTOM]: 0,
      [PointerName.REDO_TOP]: 0,
      [PointerName.REDO_BOTTOM]: 0,
    };

    mockLocalforage.getItem.mockResolvedValueOnce(null);

    const result = await processMoveAction(
      { from: UndoRedoStackName.UNDO, to: UndoRedoStackName.REDO },
      metadata,
      mockHistoryItem,
      flowId,
    );

    expect(mockLocalforage.getItem).toHaveBeenCalledWith(`undo-${flowId}-1`);
    expect(mockLocalforage.removeItem).not.toHaveBeenCalled();
    expect(mockLocalforage.setItem).not.toHaveBeenCalled();

    expect(result.metadata).toEqual(metadata);
    expect(result.lastHistoryItem).toEqual(mockHistoryItem);
  });
});

describe('createKey', () => {
  it('should generate the correct key for valid inputs', () => {
    const stackName = UndoRedoStackName.UNDO;
    const itemId = '12345';
    const pointer = 10;

    const result = createKey(stackName, itemId, pointer);

    expect(result).toBe('undo-12345-10');
  });

  it('should work with the REDO stack', () => {
    const stackName = UndoRedoStackName.REDO;
    const itemId = '67890';
    const pointer = 5;

    const result = createKey(stackName, itemId, pointer);

    expect(result).toBe('redo-67890-5');
  });

  it('should handle edge cases with unusual characters in itemId', () => {
    const stackName = UndoRedoStackName.UNDO;
    const itemId = 'item_id_with-special$characters!';
    const pointer = 99;

    const result = createKey(stackName, itemId, pointer);

    expect(result).toBe('undo-item_id_with-special$characters!-99');
  });
});
