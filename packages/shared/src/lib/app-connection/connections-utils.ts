import { isNil } from '../../lib/common/utils';

export const addConnectionBrackets = (str: string): string =>
  `{{connections['${str}']}}`;

export const removeConnectionBrackets = (
  str: string | undefined,
): string | undefined => {
  if (isNil(str)) {
    return undefined;
  }
  return str.replace(
    /\{\{connections\['(.*?)'\]\}\}/g,
    (_, connectionName) => connectionName,
  );
};
