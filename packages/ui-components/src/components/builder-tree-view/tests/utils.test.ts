import { INode } from 'react-accessible-treeview';
import {
  getExpandableNodeIds,
  getNodeAndDescendants,
  getNodeAndParents,
  RootNodeId,
} from '../utils';

describe('utils', () => {
  const data: INode[] = [
    { id: '1', name: 'Node 1', parent: null, children: [2, 3] },
    { id: '2', name: 'Node 2', parent: '1', children: [4, 5] },
    { id: '3', name: 'Node 3', parent: '1', children: [] },
    { id: '4', name: 'Node 4', parent: '2', children: [] },
    { id: '5', name: 'Node 5', parent: '2', children: [] },
  ];

  describe('getNodeAndParents', () => {
    it('should return an empty array if node is not present', () => {
      const result = getNodeAndParents(data, '6');
      expect(result).toEqual([]);
    });

    it('should return the correct subtree for a root node', () => {
      const result = getNodeAndParents(data, '1');
      expect(result).toEqual([
        { id: '1', name: 'Node 1', parent: null, children: [2, 3] },
      ]);
    });

    it('should return the subtree including the target node and its ancestors', () => {
      const result = getNodeAndParents(data, '4');

      expect(result).toEqual([
        { id: '1', name: 'Node 1', parent: null, children: [2, 3] },
        { id: '2', name: 'Node 2', parent: '1', children: [4, 5] },
        { id: '4', name: 'Node 4', parent: '2', children: [] },
      ]);
    });
  });

  describe('getNodeAndDescendants', () => {
    it('should return an empty array if node is not present', () => {
      const result = getNodeAndDescendants(data, '6');
      expect(result).toEqual([]);
    });

    it('should return only the node itself if it has no children', () => {
      const result = getNodeAndDescendants(data, '3');
      expect(result).toEqual([
        { id: '3', name: 'Node 3', parent: '1', children: [] },
      ]);
    });

    it('should return all child nodes including the target node', () => {
      const result = getNodeAndDescendants(data, '2');
      expect(result).toEqual([
        { id: '2', name: 'Node 2', parent: '1', children: [4, 5] },
        { id: '4', name: 'Node 4', parent: '2', children: [] },
        { id: '5', name: 'Node 5', parent: '2', children: [] },
      ]);
    });

    it('should return the entire tree including root for a root node', () => {
      const result = getNodeAndDescendants(data, '1');
      expect(result).toEqual(data);
    });
  });

  describe('getExpandableNodeIds', () => {
    it('should return an empty array if there are no expandable nodes', () => {
      const emptyData: INode[] = [
        { id: '6', name: 'Node 6', parent: null, children: [] },
      ];
      const result = getExpandableNodeIds(emptyData);
      expect(result).toEqual([]);
    });

    it('should return all nodes with children, excluding the root node', () => {
      const result = getExpandableNodeIds(data);
      expect(result).toEqual(['1', '2']);
    });

    it('should exclude the root node if it is in the data', () => {
      const dataWithRoot: INode[] = [
        { id: RootNodeId, name: 'Root Node', parent: null, children: [1] },
        ...data,
      ];
      const result = getExpandableNodeIds(dataWithRoot);
      expect(result).toEqual(['1', '2']);
    });
  });
});
