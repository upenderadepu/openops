import { createContext, ReactNode } from 'react';
import { FieldValues } from 'react-hook-form';

export type ArrayItem = FieldValues & {
  dynamicViewToggled: Record<string, boolean>;
  [key: string]: unknown;
};

export type State = {
  field: ArrayItem;
  inputName: string;
};

type Props = State & {
  children: ReactNode;
};

const ArrayFieldContext = createContext<State | undefined>(undefined);

const ArrayFieldContextProvider = ({ field, inputName, children }: Props) => {
  return (
    <ArrayFieldContext.Provider
      value={{
        field,
        inputName,
      }}
    >
      {children}
    </ArrayFieldContext.Provider>
  );
};

export { ArrayFieldContext, ArrayFieldContextProvider };
