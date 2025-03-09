import { disableBlockTrigger } from './hooks/disable-trigger-hook';
import { enableBlockTrigger } from './hooks/enable-trigger-hook';

export const triggerHooks = {
  enable: enableBlockTrigger,
  disable: disableBlockTrigger,
};
