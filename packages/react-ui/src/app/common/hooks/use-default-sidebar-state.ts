import { useAppStore } from '@/app/store/app-store';
import { useEffectOnce } from 'react-use';

type SidebarState = 'minimized' | 'expanded';

export const useDefaultSidebarState = (state: SidebarState) => {
  const { setIsSidebarMinimized } = useAppStore((state) => ({
    setIsSidebarMinimized: state.setIsSidebarMinimized,
  }));

  useEffectOnce(() => {
    setIsSidebarMinimized(state === 'minimized' ? true : false);
  });
};
