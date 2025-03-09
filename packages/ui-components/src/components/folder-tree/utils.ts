import { FolderItem } from './types';

/**
 * Recursively traverses the folder tree and collects the path of the root folder,
 * collecting either 'id' or 'displayName'
 * from the folder tree items it traverses.
 *
 * @param {string} folderId - The ID of the folder to find the path for.
 * @param {FolderItem[]} flowsTreeNodes - The tree of folder nodes to traverse.
 * @param {string[]} [path=[]] - The array to collect the path.
 * @param {keyof FolderItem} property - The property to collect ('id' or 'displayName').
 * @returns {string[]} An array of strings containing the folderId plus the IDs of all the parent nodes up to the root.
 */
const getPathToRoot = (
  folderId: string,
  flowsTreeNodes: FolderItem[],
  property: 'id' | 'displayName' = 'id',
  path: string[] = [],
): string[] => {
  for (const node of flowsTreeNodes) {
    if (node.id === folderId) {
      return [...path, node[property]];
    }

    if (node.children) {
      const result = getPathToRoot(folderId, node.children, property, [
        ...path,
        node[property],
      ]);
      if (result.length > 0) {
        return result;
      }
    }
  }

  return [];
};

export { getPathToRoot };
