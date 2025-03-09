import { FolderItem } from '@openops/components/ui';
import { FolderDto } from '@openops/shared';
import { FlowsSearchState } from '../../../features/flows/lib/flows-hooks';
import {
  buildFolderHierarchy,
  collectNumberOfFlows,
  findSelectedFlowParentFolder,
  getAllChildFolderItems,
  getFilteredFolders,
  getFlowLink,
  getFolderHierarchyDisplayNames,
  mapFolderDtoToFolderItem,
} from './folders-utils';

describe('folders-utils', () => {
  describe('getFlowLink', () => {
    it('should generate a link with custom search parameters', () => {
      const result = getFlowLink('flow1', true, 'customSearch');
      expect(result).toEqual({
        pathname: '/flows/flow1',
        search: 'customSearch',
      });
    });

    it('should generate a link with default viewOnly parameter', () => {
      const result = getFlowLink('flow1');
      expect(result).toEqual({
        pathname: '/flows/flow1',
        search: 'viewOnly=true',
      });
    });

    it('should generate a link with viewOnly set to false', () => {
      const result = getFlowLink('flow1', false);
      expect(result).toEqual({
        pathname: '/flows/flow1',
        search: 'viewOnly=false',
      });
    });
  });

  const mockTimestamp = '2021-01-01T00:00:00Z';
  const mockProjectId = 'project-1';

  describe('collectNumberOfFlows', () => {
    const folder: FolderDto = {
      id: '1',
      displayName: 'Root Folder',
      created: mockTimestamp,
      updated: mockTimestamp,
      projectId: mockProjectId,
      numberOfFlows: 5,
      subfolders: [
        {
          id: '1-1',
          displayName: 'Subfolder 1',
          numberOfFlows: 2,
          created: mockTimestamp,
          updated: mockTimestamp,
          projectId: mockProjectId,
          subfolders: [
            {
              id: '1-1-1',
              created: mockTimestamp,
              updated: mockTimestamp,
              projectId: mockProjectId,
              displayName: 'Subfolder 1-1',
              numberOfFlows: 1,
              subfolders: [],
            },
          ],
        },
        {
          id: '1-2',
          created: mockTimestamp,
          updated: mockTimestamp,
          projectId: mockProjectId,
          displayName: 'Subfolder 2',
          numberOfFlows: 0,
          subfolders: [],
        },
      ],
    };

    it('should collect the total number of flows in a folder and its subfolders', () => {
      const result = collectNumberOfFlows(folder);
      expect(result).toBe(8);
    });

    it('should return the number of flows if there are no subfolders', () => {
      const folderWithoutSubfolders: FolderDto = {
        id: '2',
        created: mockTimestamp,
        updated: mockTimestamp,
        projectId: mockProjectId,
        displayName: 'Another Folder',
        numberOfFlows: 3,
        subfolders: [],
      };
      const result = collectNumberOfFlows(folderWithoutSubfolders);
      expect(result).toBe(3);
    });
  });

  describe('mapFolderDtoToFolderItem', () => {
    const folder: FolderDto = {
      id: '1',
      displayName: 'Root Folder',
      created: mockTimestamp,
      updated: mockTimestamp,
      projectId: mockProjectId,
      numberOfFlows: 5,
      parentFolderId: '0',
      subfolders: [
        {
          id: '1-1',
          created: mockTimestamp,
          updated: mockTimestamp,
          projectId: mockProjectId,
          displayName: 'Subfolder 1',
          numberOfFlows: 2,
          parentFolderId: '1',
          subfolders: [
            {
              id: '1-1-1',
              created: mockTimestamp,
              updated: mockTimestamp,
              projectId: mockProjectId,
              displayName: 'Subfolder 1-1',
              numberOfFlows: 1,
              parentFolderId: '1-1',
              subfolders: [],
            },
          ],
        },
        {
          id: '1-2',
          created: mockTimestamp,
          updated: mockTimestamp,
          projectId: mockProjectId,
          displayName: 'Subfolder 2',
          numberOfFlows: 0,
          parentFolderId: '1',
          subfolders: [],
        },
      ],
      flows: [
        { id: 'flow1', displayName: 'Flow 1' },
        { id: 'flow2', displayName: 'Flow 2' },
      ],
    };

    it('should map a FolderDto to a FolderItem', () => {
      const result = mapFolderDtoToFolderItem(folder);
      expect(result).toEqual({
        id: '1',
        displayName: 'Root Folder',
        type: 'folder',
        itemCount: 8,
        parentFolderId: '0',
        children: [
          {
            id: '1-1',
            displayName: 'Subfolder 1',
            type: 'folder',
            itemCount: 3,
            parentFolderId: '1',
            children: [
              {
                id: '1-1-1',
                displayName: 'Subfolder 1-1',
                type: 'folder',
                itemCount: 1,
                parentFolderId: '1-1',
                children: [],
              },
            ],
          },
          {
            id: '1-2',
            displayName: 'Subfolder 2',
            type: 'folder',
            itemCount: 0,
            parentFolderId: '1',
            children: [],
          },
          {
            id: 'flow1',
            displayName: 'Flow 1',
            parentFolderId: '1',
            type: 'item',
          },
          {
            id: 'flow2',
            displayName: 'Flow 2',
            parentFolderId: '1',
            type: 'item',
          },
        ],
      });
    });
  });

  describe('findSelectedFlowParentFolder', () => {
    const nestedFolder: FolderItem = {
      id: '1-1-1',
      displayName: 'Subfolder 1-1',
      itemCount: 1,
      type: 'folder',
      children: [{ id: 'flow3', displayName: 'Flow 3', type: 'item' }],
    };
    const rootFolder: FolderItem = {
      id: '1',
      displayName: 'Root Folder',
      itemCount: 5,
      type: 'folder',
      children: [
        {
          id: '1-1',
          displayName: 'Subfolder 1',
          itemCount: 2,
          type: 'folder',
          children: [nestedFolder],
        },
        {
          id: '1-2',
          displayName: 'Subfolder 2',
          itemCount: 0,
          type: 'folder',
          children: [],
        },
        { id: 'flow1', displayName: 'Flow 1', type: 'item' },
        { id: 'flow2', displayName: 'Flow 2', type: 'item' },
      ],
    };

    const folders: FolderItem[] = [
      rootFolder,
      {
        id: '2',
        displayName: 'Another Root Folder',
        itemCount: 3,
        type: 'folder',
        children: [{ id: 'flow4', displayName: 'Flow 4', type: 'item' }],
      },
    ];

    it('should find the parent folder of a given flow', () => {
      const result = findSelectedFlowParentFolder(folders, 'flow3');
      expect(result).toBe(nestedFolder);
    });

    it('should return undefined if the flow ID is not found', () => {
      const result = findSelectedFlowParentFolder(folders, 'non-existent-flow');
      expect(result).toBeUndefined();
    });

    it('should find the parent folder ID of a flow in the root folder', () => {
      const result = findSelectedFlowParentFolder(folders, 'flow1');
      expect(result).toBe(rootFolder);
    });
  });

  describe('folder hierarchy', () => {
    let mockFolderItems: FolderItem[] = beforeEach(() => {
      mockFolderItems = [
        {
          id: '1',
          displayName: 'Root Folder',
          itemCount: 5,
          type: 'folder',
          children: [
            {
              id: '1-1',
              displayName: 'Subfolder 1',
              itemCount: 2,
              type: 'folder',
              children: [
                {
                  id: '1-1-1',
                  displayName: 'Subfolder 1-1',
                  itemCount: 1,
                  type: 'folder',
                  children: [],
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
            { id: 'flow1', displayName: 'Flow 1', type: 'item' },
            { id: 'flow2', displayName: 'Flow 2', type: 'item' },
          ],
        },
      ];
    });

    describe('buildFolderHierarchy', () => {
      it('should return an empty map if the folder items are undefined', () => {
        const result = buildFolderHierarchy(undefined);
        expect(result).toEqual(new Map());
      });

      it('should return an empty map if the folder items are empty', () => {
        const result = buildFolderHierarchy([]);
        expect(result).toEqual(new Map());
      });

      it('should return a map of folder IDs to their children', () => {
        const result = buildFolderHierarchy(mockFolderItems);
        expect([...result]).toEqual([
          ['1', expect.any(Array)],
          ['1-1', expect.any(Array)],
          ['1-1-1', expect.any(Array)],
          ['1-2', expect.any(Array)],
        ]);
        expect(result.get('1')?.length).toBe(1);
        expect(result.get('1-1')?.length).toBe(2);
        expect(result.get('1-1-1')?.length).toBe(3);
        expect(result.get('1-2')?.length).toBe(2);
      });
    });

    describe('getFolderHierarchyDisplayNames', () => {
      it('should return an empty array if no folders are provided', () => {
        const result = getFolderHierarchyDisplayNames(new Map());
        expect(result).toEqual([]);
      });

      it('should return root folders', () => {
        mockFolderItems[0].children = [];

        const result = buildFolderHierarchy(mockFolderItems);
        const resultDisplayNames = getFolderHierarchyDisplayNames(result);
        expect(resultDisplayNames).toEqual([
          { id: '1', displayName: 'Root Folder' },
        ]);
      });

      it('should build a folder hierarchy from a list of folders and their subfolders', () => {
        const result = buildFolderHierarchy(mockFolderItems);
        const resultDisplayNames = getFolderHierarchyDisplayNames(result);

        expect(resultDisplayNames).toEqual([
          { displayName: 'Root Folder', id: '1' },
          { displayName: 'Root Folder > Subfolder 1', id: '1-1' },
          {
            displayName: 'Root Folder > Subfolder 1 > Subfolder 1-1',
            id: '1-1-1',
          },
          { displayName: 'Root Folder > Subfolder 2', id: '1-2' },
        ]);
      });
    });

    describe('getAllChildFolderItems', () => {
      it('should return an empty array if folderItem has no children', () => {
        const mockFolderItem = mockFolderItems[0];
        mockFolderItem.children = [];

        const result = getAllChildFolderItems(mockFolderItem);

        expect(result).toEqual([]);
      });

      it('should return all child folder items', () => {
        const result = getAllChildFolderItems(mockFolderItems[0]);

        expect(result).toEqual([
          {
            id: '1-1',
            displayName: 'Subfolder 1',
            itemCount: 2,
            type: 'folder',
            children: expect.any(Array),
          },
          {
            id: '1-2',
            displayName: 'Subfolder 2',
            itemCount: 0,
            type: 'folder',
            children: [],
          },
          {
            id: '1-1-1',
            displayName: 'Subfolder 1-1',
            itemCount: 1,
            type: 'folder',
            children: [],
          },
        ]);
      });
    });
  });

  describe('getFilteredFolders', () => {
    const mockFlowsSearchState: FlowsSearchState = {
      searchTerm: '',
      loading: false,
      results: [],
    };
    const mockFolderItems: FolderItem[] = [
      {
        id: '1',
        displayName: 'First Root Folder',
        itemCount: 5,
        type: 'folder',
        children: [
          {
            id: '1-1',
            displayName: 'Subfolder 1',
            itemCount: 2,
            type: 'folder',
            children: [
              {
                id: '1-1-1',
                displayName: 'Subfolder 1-1',
                itemCount: 1,
                type: 'folder',
                children: [],
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
          { id: 'flow1', displayName: 'Flow 1', type: 'item' },
          { id: 'flow2', displayName: 'Flow 2', type: 'item' },
        ],
      },
      {
        id: '2',
        displayName: 'Second Root Folder',
        itemCount: 1,
        type: 'folder',
        children: [
          {
            type: 'folder',
            id: '2-1',
            displayName: 'Subfolder 2 1',
            itemCount: 0,
            children: [
              {
                type: 'folder',
                id: '2-1-1',
                displayName: 'Subfolder 2 1 1',
                itemCount: 0,
                children: [
                  {
                    id: '2-1-1-1',
                    displayName: 'Flow 2 1 1 1',
                    type: 'item',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    beforeEach(() => {
      mockFlowsSearchState.searchTerm = '';
      mockFlowsSearchState.results = [];
    });

    it('should return an empty array if the folder items are empty', () => {
      const result = getFilteredFolders([], mockFlowsSearchState);
      expect(result).toEqual([]);
    });

    it('should return input if there is not search term', () => {
      const result = getFilteredFolders(mockFolderItems, mockFlowsSearchState);
      expect(result).toEqual(mockFolderItems);
    });

    it('should return filtered folder items based on the search term', () => {
      mockFlowsSearchState.searchTerm = 'First Root Folder';
      const result = getFilteredFolders(mockFolderItems, mockFlowsSearchState);

      expect(result).toHaveLength(1);
      expect(result[0].displayName).toBe('First Root Folder');
      expect(result[0].children).toHaveLength(4);
      expect(result[0]?.children?.[0]?.displayName).toBe('Subfolder 1');
      expect(result[0]?.children?.[0]?.children).toHaveLength(1);
      expect(result[0]?.children?.[0]?.children?.[0]?.displayName).toBe(
        'Subfolder 1-1',
      );
    });

    it('should return filtered folder items without itemCount', () => {
      mockFlowsSearchState.searchTerm = '1';
      const result = getFilteredFolders(mockFolderItems, mockFlowsSearchState);

      expect(result[0].itemCount).toBeUndefined();
      expect(result[0]?.children?.[0]?.itemCount).toBeUndefined();
      expect(
        result[0]?.children?.[0]?.children?.[0]?.itemCount,
      ).toBeUndefined();
    });

    it('should return flows that match the search results', () => {
      mockFlowsSearchState.searchTerm = '1-1';
      mockFlowsSearchState.results = [
        { id: '1-1', version: { displayName: '1-1' } },
        { id: '1-1-1', version: { displayName: '1-1-1' } },
      ];
      const result = getFilteredFolders(mockFolderItems, mockFlowsSearchState);

      expect(result).toHaveLength(1);
      expect(result[0].displayName).toBe('First Root Folder');
      expect(result[0].children).toHaveLength(1);
      expect(result[0]?.children?.[0]?.displayName).toBe('Subfolder 1');
      expect(result[0]?.children?.[0]?.children).toHaveLength(1);
      expect(result[0]?.children?.[0]?.children?.[0]?.displayName).toBe(
        'Subfolder 1-1',
      );
    });

    it('should return only matching flows if folder name is not matched', () => {
      mockFlowsSearchState.searchTerm = 'Flow 1';
      mockFlowsSearchState.results = [
        { id: 'flow1', version: { displayName: 'Flow 1' } },
      ];

      const result = getFilteredFolders(mockFolderItems, mockFlowsSearchState);

      expect(result).toEqual([
        {
          id: '1',
          displayName: 'First Root Folder',
          type: 'folder',
          children: [
            {
              id: 'flow1',
              displayName: 'Flow 1',
              type: 'item',
            },
          ],
        },
      ]);
    });

    it('should return only matching flows if folder name is not matched for nested folders', () => {
      mockFlowsSearchState.searchTerm = 'Flow 2-1-1-1';
      mockFlowsSearchState.results = [
        { id: '2-1-1-1', version: { displayName: 'Flow 2-1-1-1' } },
      ];

      const result = getFilteredFolders(mockFolderItems, mockFlowsSearchState);

      expect(result).toEqual([
        {
          id: '2',
          displayName: 'Second Root Folder',
          type: 'folder',
          children: [
            {
              type: 'folder',
              id: '2-1',
              displayName: 'Subfolder 2 1',
              children: [
                {
                  type: 'folder',
                  id: '2-1-1',
                  displayName: 'Subfolder 2 1 1',
                  children: [
                    {
                      id: '2-1-1-1',
                      displayName: 'Flow 2 1 1 1',
                      type: 'item',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]);
    });

    it('shold return searched flows if they are not in the dataset but in search results', () => {
      mockFlowsSearchState.searchTerm = 'Flow xyz';
      mockFlowsSearchState.results = [
        {
          id: 'xyz',
          version: { displayName: 'Flow xyz' },
          folderId: '1',
        },
      ];

      const result = getFilteredFolders(mockFolderItems, mockFlowsSearchState);

      expect(result).toEqual([
        {
          id: '1',
          displayName: 'First Root Folder',
          type: 'folder',
          children: [
            {
              displayName: 'Flow xyz',
              id: 'xyz',
              parentFolderId: '1',
              type: 'item',
            },
          ],
          itemCount: undefined,
        },
      ]);
    });
  });
});
