import { renderHook } from '@testing-library/react';

import { flagsHooks } from '../../../../../common/hooks/flags-hooks';

import { useFlowVersionUndoRedo } from '../flow-version-undo-redo';
import { useKeyboardFlowVersionUndoRedo } from '../keyboard-history-shortcuts';

// Mock the useFlowVersionUndoRedo hook
jest.mock('../flow-version-undo-redo', () => ({
  useFlowVersionUndoRedo: jest.fn(),
}));

// Mock the flagsHooks.useFlag hook
jest.mock('@/app/common/hooks/flags-hooks', () => ({
  flagsHooks: {
    useFlag: jest.fn(),
  },
}));

function createMockKeyboardEvent(
  type: string,
  payload: KeyboardEventInit,
  target: EventTarget = document.body,
): KeyboardEvent {
  const event = new KeyboardEvent(type, payload);
  // keyboards events without a target will be ignored
  Object.defineProperty(event, 'target', {
    value: target,
    writable: false,
  });
  return event;
}

describe('useKeyboardHistoryShortcuts', () => {
  const mockUndo = jest.fn();
  const mockRedo = jest.fn();
  const mockCanUndo = true;
  const mockCanRedo = true;

  beforeEach(() => {
    (useFlowVersionUndoRedo as jest.Mock).mockReturnValue({
      undo: mockUndo,
      redo: mockRedo,
      canUndo: mockCanUndo,
      canRedo: mockCanRedo,
    });

    (flagsHooks.useFlag as jest.Mock).mockReturnValue({
      data: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const undoKeyboadEventInitVariants = [
    {
      description: 'ctrl+z',
      payload: { key: 'z', ctrlKey: true },
    },
    {
      description: 'ctrl+Z',
      payload: { key: 'Z', ctrlKey: true },
    },
    {
      description: 'command+z',
      payload: { key: 'z', metaKey: true },
    },
  ];

  undoKeyboadEventInitVariants.forEach(({ description, payload }) => {
    it(`should call undo operation when ${description} is pressed`, () => {
      renderHook(() => useKeyboardFlowVersionUndoRedo());

      const event = createMockKeyboardEvent('keydown', payload);
      window.dispatchEvent(event);

      expect(mockUndo).toHaveBeenCalled();
    });
  });

  it('should call undo operation when meta+z is pressed', () => {
    renderHook(() => useKeyboardFlowVersionUndoRedo());

    const event = createMockKeyboardEvent('keydown', {
      key: 'z',
      metaKey: true,
    });
    window.dispatchEvent(event);

    expect(mockUndo).toHaveBeenCalled();
  });

  const mockElementOutsideOfCanvas = document.createElement('div');
  undoKeyboadEventInitVariants.forEach(({ description, payload }) => {
    it(`should not call undo operation when pressed outside of the flow canvas`, () => {
      renderHook(() => useKeyboardFlowVersionUndoRedo());

      const event = createMockKeyboardEvent(
        'keydown',
        payload,
        mockElementOutsideOfCanvas,
      );
      window.dispatchEvent(event);

      expect(mockUndo).not.toHaveBeenCalled();
    });
  });

  const badUndoKeyboadEventInitVariants = [
    {
      description: 'ctrl+shift+z',
      payload: { key: 'z', shiftKey: true, ctrlKey: true },
    },
    {
      description: 'ctrl+shift+Z',
      payload: { key: 'Z', shiftKey: true, ctrlKey: true },
    },
    {
      description: 'command+shift+z',
      payload: { key: 'z', shiftKey: true, metaKey: true },
    },
  ];

  badUndoKeyboadEventInitVariants.forEach(({ description, payload }) => {
    it(`should not call undo operation when ${description} is pressed`, () => {
      renderHook(() => useKeyboardFlowVersionUndoRedo());

      const event = createMockKeyboardEvent('keydown', payload);
      window.dispatchEvent(event);

      expect(mockUndo).not.toHaveBeenCalled();
    });
  });

  const redooKeyboadEventInitVariants = [
    {
      description: 'ctrl+shift+z',
      payload: { key: 'z', shiftKey: true, ctrlKey: true },
    },
    {
      description: 'command+shift+z',
      payload: { key: 'z', shiftKey: true, metaKey: true },
    },
    {
      description: 'ctrl+y',
      payload: { key: 'y', ctrlKey: true },
    },
  ];

  redooKeyboadEventInitVariants.forEach(({ description, payload }) => {
    it(`should not call undo operation when ${description} is pressed`, () => {
      renderHook(() => useKeyboardFlowVersionUndoRedo());

      const event = createMockKeyboardEvent('keydown', payload);

      window.dispatchEvent(event);

      expect(mockRedo).toHaveBeenCalled();
    });
  });

  const preventDefaultBrowserEventVariants = [
    {
      description: 'ctrl+z',
      payload: { key: 'z', ctrlKey: true },
    },
    {
      description: 'ctrl+shift+z',
      payload: { key: 'z', shiftKey: true, ctrlKey: true },
    },
  ];

  preventDefaultBrowserEventVariants.forEach(({ description, payload }) => {
    it(`should prevent default browser behavior when ${description} is pressed`, () => {
      renderHook(() => useKeyboardFlowVersionUndoRedo());

      const event = createMockKeyboardEvent('keydown', payload);
      const preventDefault = jest.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  it('should not call undo operation if canUndo is false', () => {
    (useFlowVersionUndoRedo as jest.Mock).mockReturnValue({
      undo: mockUndo,
      redo: mockRedo,
      canUndo: false,
      canRedo: mockCanRedo,
    });

    renderHook(() => useKeyboardFlowVersionUndoRedo());

    const event = createMockKeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
    });
    window.dispatchEvent(event);

    expect(mockUndo).not.toHaveBeenCalled();
  });

  it('should not call redo operation if canRedo is false', () => {
    (useFlowVersionUndoRedo as jest.Mock).mockReturnValue({
      undo: mockUndo,
      redo: mockRedo,
      canUndo: mockCanUndo,
      canRedo: false,
    });

    renderHook(() => useKeyboardFlowVersionUndoRedo());

    const event = createMockKeyboardEvent('keydown', {
      key: 'y',
      ctrlKey: true,
    });
    window.dispatchEvent(event);

    expect(mockRedo).not.toHaveBeenCalled();
  });
});
