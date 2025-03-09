import { FolderItem } from './types';
import { getPathToRoot } from './utils';

describe('getPathToRoot', () => {
  const flowsTreeNodes: FolderItem[] = [
    {
      id: '1',
      displayName: 'Root Folder',
      type: 'folder',
      itemCount: 5,
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
              type: 'folder',
              itemCount: 1,
              children: [],
            },
          ],
        },
        {
          id: '1-2',
          displayName: 'Subfolder 2',
          type: 'folder',
          itemCount: 0,
          children: [],
        },
      ],
    },
    {
      id: '2',
      displayName: 'Another Root Folder',
      type: 'folder',
      itemCount: 3,
      children: [],
    },
  ];

  it('should return the correct path to the root for a given folder ID', () => {
    const result = getPathToRoot('1-1-1', flowsTreeNodes);
    expect(result).toEqual(['1', '1-1', '1-1-1']);
  });

  it('should return an empty array if the folder ID is not found', () => {
    const result = getPathToRoot('non-existent-id', flowsTreeNodes);
    expect(result).toEqual([]);
  });

  it('should return only the root folder ID if it has no parents', () => {
    const result = getPathToRoot('2', flowsTreeNodes);
    expect(result).toEqual(['2']);
  });
});
