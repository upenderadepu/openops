import { Trigger } from '@openops/shared';
import { ReactFlowProvider } from '@xyflow/react';
import { createContext, ReactNode, useContext } from 'react';

export type TemplateCanvasContextState = {
  template: Trigger;
};

export type TemplateCanvasProviderProps = TemplateCanvasContextState & {
  children: ReactNode;
};

const TemplateCanvasContext = createContext<
  TemplateCanvasContextState | undefined
>(undefined);

export const TemplateCanvasProvider = ({
  template,
  children,
}: TemplateCanvasProviderProps) => {
  return (
    <TemplateCanvasContext.Provider
      value={{
        template,
      }}
    >
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </TemplateCanvasContext.Provider>
  );
};

export const useTemplateCanvasContext = () => {
  const context = useContext(TemplateCanvasContext);
  if (context === undefined) {
    throw new Error(
      'useTemplateCanvasContext must be used within a TemplateCanvasProvider',
    );
  }
  return context;
};
