import { cloneDeep, set } from 'lodash-es';

export const getTransformedKey = (
  key: string,
  numberReplacement: string,
  stringReplacement: string,
) => {
  return key
    .split('.')
    .map((part) => {
      if (part === '') {
        return ''; // Keep empty parts intact (for consecutive dots)
      } else if (!isNaN(Number(part))) {
        return `${numberReplacement}${part}`;
      } else {
        return `${stringReplacement}${part}`;
      }
    })
    .join('.');
};

export const updateArraySchemaItemsCount = (
  arrayKey: string,
  schema: any,
  newAmount: number,
) => {
  const currentSchema = cloneDeep(schema);

  set(currentSchema, `${arrayKey}.minItems`, newAmount);
  set(currentSchema, `${arrayKey}.maxItems`, newAmount);

  return currentSchema;
};

export const getArraySchemaNewLength = (
  newLength: number,
  arrayRequired = false,
) => {
  return newLength ? newLength : arrayRequired ? 1 : 0;
};
