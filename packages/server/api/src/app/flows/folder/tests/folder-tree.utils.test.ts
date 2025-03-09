/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FolderDto,
  PopulatedFlow,
  UNCATEGORIZED_FOLDER_DISPLAY_NAME,
  UNCATEGORIZED_FOLDER_ID,
} from '@openops/shared';
import { buildFolderTree, FolderWithFlows } from '../folder-tree.utils';
import { FolderSchema } from '../folder.entity';

describe('buildFolderTree', () => {
  const uncategorizedFolder: FolderDto = {
    id: UNCATEGORIZED_FOLDER_ID,
    projectId: 'project1',
    created: new Date().toDateString(),
    updated: new Date().toDateString(),
    displayName: UNCATEGORIZED_FOLDER_DISPLAY_NAME,
    numberOfFlows: 0,
    flows: [],
    subfolders: [],
  };

  it('should return uncategorized folder when no folders provided', () => {
    const result = buildFolderTree([], uncategorizedFolder);
    expect(result).toEqual([uncategorizedFolder]);
  });

  it('should create a flat structure for folders without parent relationships', () => {
    const folders: FolderWithFlows[] = [
      {
        id: 'folder1',
        projectId: 'project1',
        created: new Date().toDateString(),
        updated: new Date().toDateString(),
        displayName: 'Folder 1',
        numberOfFlows: 2,
        flows: [],
        subfolders: [],
        project: {} as any,
      },
      {
        id: 'folder2',
        projectId: 'project1',
        created: new Date().toDateString(),
        updated: new Date().toDateString(),
        displayName: 'Folder 2',
        numberOfFlows: 1,
        flows: [],
        project: {} as any,
      },
    ];

    const result = buildFolderTree(folders, uncategorizedFolder);
    expect(result.length).toBe(3);
    expect(result.map((f) => f.id)).toContain('folder1');
    expect(result.map((f) => f.id)).toContain('folder2');
  });

  it('should create nested structure for folders with parent relationships', () => {
    const folders: FolderWithFlows[] = [
      {
        id: 'parent',
        projectId: 'project1',
        created: new Date().toDateString(),
        updated: new Date().toDateString(),
        displayName: 'Parent Folder',
        numberOfFlows: 0,
        flows: [],
        project: {} as any,
      },
      {
        id: 'child',
        projectId: 'project1',
        created: new Date().toDateString(),
        updated: new Date().toDateString(),
        displayName: 'Child Folder',
        numberOfFlows: 1,
        flows: [],
        parentFolder: { id: 'parent' } as FolderSchema,
        project: {} as any,
      },
    ];

    const result = buildFolderTree(folders, uncategorizedFolder);

    expect(result.length).toBe(2);
    const parentFolder = result.find((f) => f.id === 'parent');
    expect(parentFolder?.subfolders?.length).toBe(1);
    expect(parentFolder?.subfolders?.[0].id).toBe('child');
  });

  it('should handle folders with flows', () => {
    const flow = {
      id: 'flow1',
      version: { displayName: 'Test Flow' },
    } as PopulatedFlow;

    const folders: FolderWithFlows[] = [
      {
        id: 'folder1',
        projectId: 'project1',
        created: new Date().toDateString(),
        updated: new Date().toDateString(),
        displayName: 'Folder 1',
        numberOfFlows: 1,
        flows: [flow],
        project: {} as any,
      },
    ];

    const result = buildFolderTree(folders, uncategorizedFolder);

    const folder = result.find((f) => f.id === 'folder1');
    expect(folder?.flows?.length).toBe(1);
    expect(folder?.flows?.[0]).toEqual({
      id: 'flow1',
      displayName: 'Test Flow',
    });
  });

  it('should handle deep nested folders', () => {
    const folders: FolderWithFlows[] = [
      {
        id: 'level1',
        projectId: 'project1',
        created: new Date().toDateString(),
        updated: new Date().toDateString(),
        displayName: 'Level 1',
        numberOfFlows: 0,
        flows: [],
        project: {} as any,
      },
      {
        id: 'level2',
        projectId: 'project1',
        created: new Date().toDateString(),
        updated: new Date().toDateString(),
        displayName: 'Level 2',
        numberOfFlows: 0,
        flows: [],
        parentFolder: { id: 'level1' } as FolderSchema,
        project: {} as any,
      },
      {
        id: 'level3',
        projectId: 'project1',
        created: new Date().toDateString(),
        updated: new Date().toDateString(),
        displayName: 'Level 3',
        numberOfFlows: 1,
        flows: [],
        parentFolder: { id: 'level2' } as FolderSchema,
        project: {} as any,
      },
    ];

    const result = buildFolderTree(folders, uncategorizedFolder);

    expect(result.length).toBe(2);
    const level1 = result.find((f) => f.id === 'level1');
    expect(level1?.subfolders?.length).toBe(1);
    const level2 = level1?.subfolders?.[0];
    expect(level2?.id).toBe('level2');
    expect(level2?.subfolders?.length).toBe(1);
    expect(level2?.subfolders?.[0].id).toBe('level3');
  });
});
