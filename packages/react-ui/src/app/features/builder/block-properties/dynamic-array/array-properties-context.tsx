import { createContext, ReactNode } from 'react';

import { DynamicArrayProperties } from '@/app/features/builder/block-properties/dynamic-array/types';

export type ArrayPropsState = {
  parentPropertyKey: string;
  properties: {
    dynamic: Record<string, DynamicArrayProperties>;
    fields: Array<Record<string, unknown>>;
  };
};

export type ArrayPropertiesProviderProps = ArrayPropsState & {
  children: ReactNode;
};

const ArrayPropertiesContext = createContext<ArrayPropsState | undefined>(
  undefined,
);

const ArrayPropertiesProvider = ({
  parentPropertyKey,
  properties,
  children,
}: ArrayPropertiesProviderProps) => {
  return (
    <ArrayPropertiesContext.Provider
      value={{
        parentPropertyKey,
        properties,
      }}
    >
      {children}
    </ArrayPropertiesContext.Provider>
  );
};

export { ArrayPropertiesContext, ArrayPropertiesProvider };
