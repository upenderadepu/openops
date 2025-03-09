import { INode, NodeId } from 'react-accessible-treeview';

export const RootNodeId = 'root';

export const getNodeAndParents = (
  data: INode[],
  id: string | number,
): INode[] => {
  const subTree = [];
  let currentNode = data.find((node) => node.id === id);

  while (currentNode) {
    subTree.push(currentNode);
    currentNode = data.find((node) => node.id === currentNode?.parent);
  }

  return subTree.reverse();
};

export const getNodeAndDescendants = (data: INode[], id: string | number) => {
  let currentNodes = [data.find((node) => node.id === id)!];
  if (!currentNodes[0]) return [];

  const highlightedNodes: INode[] = currentNodes;

  while (currentNodes.length > 0) {
    currentNodes = data.filter((node) =>
      currentNodes.map((n) => n.id).includes(node.parent!),
    );
    highlightedNodes.push(...currentNodes);
  }

  return highlightedNodes;
};

export const getExpandableNodeIds = (data: INode[]): NodeId[] => {
  return data
    .filter((node) => node.children.length > 0 && node.id !== RootNodeId)
    .map((node) => node.id);
};
