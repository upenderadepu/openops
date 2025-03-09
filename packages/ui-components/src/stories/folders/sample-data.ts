import { FolderItem } from '../../components/folder-tree';

export const sampleFolderData: FolderItem[] = [
  {
    id: 'NULL',
    displayName: 'Uncategorized',
    type: 'folder',
    itemCount: 2,
    children: [
      {
        id: 'flow1',
        displayName: 'Uncategorized Flow 1',
        type: 'item',
      },
      {
        id: 'flow2',
        displayName: 'Uncategorized Flow 2',
        type: 'item',
      },
    ],
  },
  {
    id: 'F7egxEO3XnAiTmUxelpwu',
    displayName: 'New folder',
    type: 'folder',
    itemCount: 4,
    children: [
      {
        id: 'uRb1w7WYjICkRehMPROtk',
        displayName: 'Bulk idle EBS cleanup',
        type: 'item',
      },
      {
        id: 'tzrR7yZqcG5g3KGzbuRrj',
        displayName: 'split update issue on other nodes',
        type: 'item',
      },
      {
        id: 'subfolder_no_children',
        displayName: 'empty',
        type: 'folder',
        itemCount: 0,
      },
      {
        id: 'hsYQIvK4BZJaASG5ysFFb',
        displayName: 'subfolder',
        type: 'folder',
        itemCount: 2,
        children: [
          {
            id: 'fSidclcWb0C8mby5AIw12',
            displayName: 'subfolder flow',
            type: 'item',
          },
          {
            id: 'WKX0hIuccEBWHRfyrmHET',
            displayName: 'sub-subfolder',
            type: 'folder',
            itemCount: 1,
            children: [
              {
                id: 'qpJKx7eoo9bOJaGzPZcoJ',
                displayName: 'sub-sub flow',
                type: 'item',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '1n02jZkuuWayqGLfFcFK5',
    displayName: 'Workflow Optimization [AWS] - Rightsizing',
    type: 'folder',
    itemCount: 0,
    children: [],
  },
];

export const generateDeeplyNestedFolder = (
  levels: number,
  displayNameToken = '',
): FolderItem => {
  let currentLevel: FolderItem = {
    id: `level-${levels}`,
    displayName: displayNameToken || `Subfolder ${levels}`,
    type: 'folder',
    parentFolderId: levels > 1 ? `level-${levels - 1}` : undefined,
    itemCount: 0,
    children: [],
  };

  for (let i = levels - 1; i > 0; i--) {
    currentLevel = {
      id: `level-${i}`,
      displayName: `${
        displayNameToken || (i > 1 ? 'Subfolder' : 'Folder')
      } ${i}`,
      type: 'folder',
      parentFolderId: i > 1 ? `level-${i - 1}` : undefined,
      itemCount: 0,
      children: [currentLevel],
    };
  }

  return currentLevel;
};
