import { isNil } from '@openops/shared';
import { ProcessorFn } from './types';

export const numberProcessor: ProcessorFn = (_property, value) => {
  if (isNil(value)) {
    return value;
  }
  if (value === '') {
    return NaN;
  }
  return Number(value);
};
