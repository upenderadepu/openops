import { FolderItem } from '@openops/components/ui';
import { renderHook } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { findSelectedFlowParentFolder } from '../lib/folders-utils';
import { useFlowParentFolder } from './use-flow-parent-folder';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('../lib/folders-utils', () => ({
  findSelectedFlowParentFolder: jest.fn(),
}));

describe('useFlowParentFolder', () => {
  const mockFolders: FolderItem[] = [
    {
      id: '1',
      displayName: 'Root Folder',
      itemCount: 5,
      type: 'folder',
      children: [
        {
          id: '1-1',
          displayName: 'Subfolder 1',
          type: 'folder',
          itemCount: 2,
          children: [
            {
              id: '1-1-1',
              displayName: 'Subfolder 1-1',
              itemCount: 1,
              type: 'folder',
              children: [{ type: 'item', id: 'flow3', displayName: 'Flow 3' }],
            },
          ],
        },
        {
          id: '1-2',
          displayName: 'Subfolder 2',
          itemCount: 0,
          type: 'folder',
          children: [],
        },
        { type: 'item', id: 'flow1', displayName: 'Flow 1' },
        { type: 'item', id: 'flow2', displayName: 'Flow 2' },
      ],
    },
    {
      id: '2',
      displayName: 'Another Root Folder',
      itemCount: 3,
      type: 'folder',
      children: [{ type: 'item', id: 'flow4', displayName: 'Flow 4' }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined if flowId is undefined', () => {
    (useParams as jest.Mock).mockReturnValue({ flowId: undefined });

    const { result } = renderHook(() => useFlowParentFolder(mockFolders));

    expect(result.current).toBeUndefined();
    expect(findSelectedFlowParentFolder).not.toHaveBeenCalled();
  });

  it('should call findSelectedFlowParentFolder with flowId if flowId is present', () => {
    const mockFlowId = 'flow1';
    (useParams as jest.Mock).mockReturnValue({ flowId: mockFlowId });

    renderHook(() => useFlowParentFolder(mockFolders));

    expect(findSelectedFlowParentFolder).toHaveBeenCalledWith(
      mockFolders,
      mockFlowId,
    );
  });
});
