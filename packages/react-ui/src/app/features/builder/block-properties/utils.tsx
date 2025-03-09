import { State } from '@/app/features/builder/block-properties/dynamic-array/array-field-context';

export const CUSTOMIZED_INPUT_KEY = 'settings.inputUiInfo.customizedInputs.';

export const isDynamicViewToggled = (
  form: any,
  arrayFieldContext: State | undefined,
  propertyName: string,
  inputName: string,
): boolean => {
  if (arrayFieldContext) {
    return !!arrayFieldContext.field.dynamicViewToggled?.[propertyName];
  }

  // The structure has changed. Previouslu we store information based on `propertyName`,
  // but replaced it with `inputName`, so to avoid migrating existing workflows,
  // added logic to check if proreperty is dynamic based on both.
  // TODO: Remove the `propertyName` check once all workflows are migrated.
  return (
    form.getValues(`${CUSTOMIZED_INPUT_KEY}${inputName}`) === true ||
    form.getValues(`${CUSTOMIZED_INPUT_KEY}${propertyName}`) === true
  );
};
