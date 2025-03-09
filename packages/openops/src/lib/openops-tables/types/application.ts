export type Application = {
  id: number;
  name: string;
  order: number;
  type: string;
  group: Group;
  workspace: Workspace;
};

export type Group = {
  id: number;
  name: string;
};

export type Workspace = {
  id: number;
  name: string;
};
