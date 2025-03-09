import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type ConnectionsContextType = {
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
};

const ConnectionsContext = createContext<ConnectionsContextType | undefined>(
  undefined,
);

export const useConnectionsContext = () => {
  const context = useContext(ConnectionsContext);
  if (!context) {
    throw new Error(
      'useConnectionsContext must be used within a ConnectionsProvider',
    );
  }
  return context;
};

export const ConnectionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refresh, setRefresh] = useState(false);

  return (
    <ConnectionsContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </ConnectionsContext.Provider>
  );
};
