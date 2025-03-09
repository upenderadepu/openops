import { createContext, ReactNode, useContext, useState } from 'react';

type BuilderTreeViewContextType = {
  selectedId?: string | number;
  expandedIds: (string | number)[];
  setExpandedIds: React.Dispatch<React.SetStateAction<(string | number)[]>>;
};

type Props = {
  children: ReactNode;
  selectedId?: string;
};

const BuilderTreeViewContext = createContext<
  BuilderTreeViewContextType | undefined
>(undefined);

export const BuilderTreeViewProvider = ({ children, selectedId }: Props) => {
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([]);

  return (
    <BuilderTreeViewContext.Provider
      value={{ selectedId, expandedIds, setExpandedIds }}
    >
      {children}
    </BuilderTreeViewContext.Provider>
  );
};

export const useBuilderTreeViewContext = (): BuilderTreeViewContextType => {
  const context = useContext(BuilderTreeViewContext);
  if (!context) {
    throw new Error(
      'useBuilderTreeViewContext must be used within a BuilderTreeViewProvider',
    );
  }
  return context;
};
