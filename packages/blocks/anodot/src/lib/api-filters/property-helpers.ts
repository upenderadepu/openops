import { Property } from '@openops/blocks-framework';

export function booleanProperty(
  displayName: string,
  description: string,
  required?: boolean,
  defaultValue?: any,
) {
  return Property.StaticDropdown({
    displayName: displayName,
    description: description,
    options: {
      options: [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' },
      ],
    },
    required: required ?? false,
    defaultValue: defaultValue,
  });
}

export function operatorProperty(
  displayName: string,
  description: string,
  required?: boolean,
  defaultValue?: any,
) {
  return Property.StaticDropdown({
    displayName: displayName,
    description: description,
    options: {
      options: [
        { label: 'AND', value: 'AND' },
        { label: 'OR', value: 'OR' },
      ],
    },
    required: required ?? false,
    defaultValue: defaultValue,
  });
}

export function dateProperty(
  displayName: string,
  description: string,
  required?: boolean,
) {
  return Property.DateTime({
    displayName: displayName,
    description: description,
    required: required ?? true,
  });
}
