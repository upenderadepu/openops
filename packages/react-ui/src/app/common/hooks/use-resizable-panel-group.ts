import { useDebounceCallback } from 'usehooks-ts';

export const useResizablePanelGroup = () => {
  const setPanelGroupSize = useDebounceCallback(
    (name: string, size: number[]) => {
      localStorage.setItem(name, JSON.stringify(size));
    },
    300,
  );

  const getPanelGroupSize = (name: string): number[] => {
    const sizeJson = localStorage.getItem(name);
    if (!sizeJson) {
      return [];
    }
    return JSON.parse(sizeJson);
  };

  return { setPanelGroupSize, getPanelGroupSize };
};
