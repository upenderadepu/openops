export type TreeNode = {
  id: string;
  name: string;
  isBranch: boolean;
  children: TreeNode[];
  metadata: {
    nodeName: string;
    nodeType: string;
    isDefaultBranch?: boolean;
  };
};
