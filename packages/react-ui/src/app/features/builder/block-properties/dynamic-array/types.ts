import { ArraySubProps } from '@openops/blocks-framework';

export type ValueOf<T> = T[keyof T];
export type ArrayProperties = ValueOf<ArraySubProps<boolean>>;

export type ArrayPropertiesWithRefreshers = ArrayProperties & {
  refreshers: string[];
};

export type DynamicArrayProperties = ArrayProperties & {
  isDynamic?: boolean;
  refreshFieldAttributes?: string[];
};
