import { LeftSideBarType, useBuilderStateContext } from '../../builder-hooks';

export const useIsLeftSideBarMenuCollapsed = () => {
  const [leftSidebar] = useBuilderStateContext((state) => [state.leftSidebar]);
  return leftSidebar === LeftSideBarType.MENU;
};
