import { FlowVersion, Trigger } from '@openops/shared';
import localforage from 'localforage';
import { act } from 'react';
import { useBuilderStateContext } from '../../../builder-hooks';
import { MAX_UNDO_REDO_SIZE } from '../../constants';
import { PointerName, UndoRedoStackName } from '../../enums';
import { FlowVersionUndoRedoHistoryItem } from '../../types';
import { useUndoRedoDB } from '../undo-redo-db';

jest.mock('localforage');
jest.mock('../../../builder-hooks', () => ({
  useBuilderStateContext: jest.fn(),
}));

const mockLocalforage = localforage as jest.Mocked<typeof localforage>;
const mockUseBuilderStateContext = useBuilderStateContext as jest.Mock;

describe('useUndoRedoDB', () => {
  let db: ReturnType<typeof useUndoRedoDB>;
  const setCanUndo = jest.fn();
  const setCanRedo = jest.fn();
  const flowId = 'flowId';

  beforeEach(() => {
    mockUseBuilderStateContext.mockReturnValue([setCanUndo, setCanRedo]);
    mockLocalforage.getItem.mockResolvedValue(null);
    mockLocalforage.setItem.mockResolvedValue(undefined);
    mockLocalforage.removeItem.mockResolvedValue(undefined);
    mockLocalforage.clear.mockResolvedValue(undefined);

    db = useUndoRedoDB(flowId);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set initial metadata if none exists', async () => {
    await db.initializeUndoRedoDB();
    expect(mockLocalforage.getItem).toHaveBeenCalledWith('metadata');
    expect(mockLocalforage.setItem).toHaveBeenCalledWith('metadata', {
      [PointerName.UNDO_TOP]: 0,
      [PointerName.UNDO_BOTTOM]: 0,
      [PointerName.REDO_TOP]: 0,
      [PointerName.REDO_BOTTOM]: 0,
    });
  });

  it('should add a new item to the undo stack and update metadata', async () => {
    const mockHistoryItem: FlowVersionUndoRedoHistoryItem = {
      id: '123',
      snapshot: { displayName: 'trigger' } as Trigger,
      spotlightStepName: 'step',
    };

    const mockMetadata = {
      undoTop: 0,
      undoBottom: 0,
      redoTop: 0,
      redoBottom: 0,
    };

    mockLocalforage.getItem.mockResolvedValueOnce(mockMetadata);

    await act(async () => {
      await db.addToUndo(mockHistoryItem);
    });

    expect(mockLocalforage.setItem).toHaveBeenCalledWith(
      `undo-${flowId}-1`,
      mockHistoryItem,
    );

    expect(mockLocalforage.setItem).toHaveBeenCalledWith(
      'metadata',
      expect.objectContaining({
        undoTop: 1,
        undoBottom: 0,
      }),
    );

    expect(setCanUndo).toHaveBeenCalledWith(true);
    expect(setCanRedo).toHaveBeenCalledWith(false);
  });

  it('should add a new item to the undo stack, clear the redo stack, and update metadata', async () => {
    const mockHistoryItem: FlowVersionUndoRedoHistoryItem = {
      id: 'flow-1',
      snapshot: { displayName: 'trigger' } as Trigger,
      spotlightStepName: 'step1',
    };

    const mockMetadata = {
      undoTop: 0,
      undoBottom: 0,
      redoTop: 3,
      redoBottom: 1,
    };

    mockLocalforage.getItem
      .mockResolvedValueOnce(mockMetadata)
      .mockResolvedValueOnce(mockMetadata);

    await act(async () => {
      await db.addToUndo(mockHistoryItem);
    });

    expect(mockLocalforage.removeItem).toHaveBeenCalledWith(`redo-${flowId}-2`);
    expect(mockLocalforage.removeItem).toHaveBeenCalledWith(`redo-${flowId}-3`);

    expect(mockLocalforage.setItem).toHaveBeenCalledWith(
      `undo-${flowId}-1`,
      mockHistoryItem,
    );

    expect(mockLocalforage.setItem).toHaveBeenCalledWith(
      'metadata',
      expect.objectContaining({
        undoTop: 1,
        undoBottom: 0,
      }),
    );

    expect(setCanUndo).toHaveBeenCalledWith(true);

    expect(mockLocalforage.setItem).toHaveBeenCalledWith(
      'metadata',
      expect.objectContaining({
        redoTop: 0,
        redoBottom: 0,
      }),
    );

    expect(setCanRedo).toHaveBeenCalledWith(false);
  });

  it('should remove the oldest item if the undo stack exceeds the maximum size', async () => {
    const mockHistoryItem: FlowVersionUndoRedoHistoryItem = {
      id: 'flow-1',
      snapshot: { displayName: 'trigger' } as Trigger,
      spotlightStepName: 'step1',
    };

    const mockMetadata = {
      undoTop: MAX_UNDO_REDO_SIZE + 1,
      undoBottom: 1,
      redoTop: 0,
      redoBottom: 0,
    };

    mockLocalforage.getItem.mockResolvedValueOnce(mockMetadata);

    await act(async () => {
      await db.addToUndo(mockHistoryItem);
    });

    // Verify the oldest item is removed
    expect(mockLocalforage.removeItem).toHaveBeenCalledWith(`undo-${flowId}-2`);

    // Verify new item is added
    expect(mockLocalforage.setItem).toHaveBeenCalledWith(
      `undo-${flowId}-${MAX_UNDO_REDO_SIZE + 2}`,
      mockHistoryItem,
    );

    // Verify metadata is updated
    expect(mockLocalforage.setItem).toHaveBeenCalledWith(
      'metadata',
      expect.objectContaining({
        undoTop: MAX_UNDO_REDO_SIZE + 2,
        undoBottom: 2,
      }),
    );
  });

  describe('bulkMoveAction', () => {
    const mockItem = {
      snapshot: {},
      id: '123',
      spotlightStepName: 'step',
    };

    it('should move items from undo to redo stacks', async () => {
      const mockMetadata = {
        [PointerName.UNDO_TOP]: 1,
        [PointerName.UNDO_BOTTOM]: 0,
        [PointerName.REDO_TOP]: 0,
        [PointerName.REDO_BOTTOM]: 0,
      };
      mockLocalforage.getItem
        .mockResolvedValueOnce(mockMetadata)
        .mockResolvedValueOnce(mockItem);

      const result = await db.bulkMoveAction(
        [{ from: UndoRedoStackName.UNDO, to: UndoRedoStackName.REDO }],
        {
          id: '123',
          trigger: { displayName: 'trigger' } as Trigger,
        } as FlowVersion,
      );

      expect(mockLocalforage.setItem).toHaveBeenCalledWith(
        `redo-${flowId}-1`,
        expect.objectContaining({ spotlightStepName: 'step' }),
      );
      expect(result).toEqual(mockItem);
    });

    it('should move items from redo to undo stacks', async () => {
      const mockMetadata = {
        [PointerName.UNDO_TOP]: 0,
        [PointerName.UNDO_BOTTOM]: 0,
        [PointerName.REDO_TOP]: 1,
        [PointerName.REDO_BOTTOM]: 0,
      };
      mockLocalforage.getItem
        .mockResolvedValueOnce(mockMetadata)
        .mockResolvedValueOnce(mockItem);

      const result = await db.bulkMoveAction(
        [{ from: UndoRedoStackName.REDO, to: UndoRedoStackName.UNDO }],
        {
          id: '123',
          trigger: { displayName: 'trigger' } as Trigger,
        } as FlowVersion,
      );

      expect(mockLocalforage.setItem).toHaveBeenCalledWith(
        `undo-${flowId}-1`,
        expect.objectContaining({ spotlightStepName: 'step' }),
      );
      expect(result).toEqual(mockItem);
    });

    it('should do nothing when stack is empty', async () => {
      const mockMetadata = {
        [PointerName.UNDO_TOP]: 0,
        [PointerName.UNDO_BOTTOM]: 0,
        [PointerName.REDO_TOP]: 0,
        [PointerName.REDO_BOTTOM]: 0,
      };
      mockLocalforage.getItem.mockResolvedValueOnce(mockMetadata);

      const result = await db.bulkMoveAction(
        [{ from: UndoRedoStackName.REDO, to: UndoRedoStackName.UNDO }],
        {
          id: '123',
          trigger: { displayName: 'trigger' } as Trigger,
        } as FlowVersion,
      );

      expect(mockLocalforage.setItem).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('clearUndoRedoDB', () => {
    it('should clear the database and reset metadata', async () => {
      await db.clearUndoRedoDB();

      expect(mockLocalforage.clear).toHaveBeenCalled();
      expect(mockLocalforage.setItem).toHaveBeenCalledWith('metadata', {
        [PointerName.UNDO_TOP]: 0,
        [PointerName.UNDO_BOTTOM]: 0,
        [PointerName.REDO_TOP]: 0,
        [PointerName.REDO_BOTTOM]: 0,
      });
    });
  });
});
