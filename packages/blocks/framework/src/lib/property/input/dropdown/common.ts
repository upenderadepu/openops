import { Type } from '@sinclair/typebox';

export const DropdownOption = Type.Object({
  label: Type.String(),
  value: Type.Unknown(),
});

export type DropdownOption<T> = {
  label: string;
  value: T;
};

export const DropdownState = Type.Object({
  disabled: Type.Optional(Type.Boolean()),
  placeholder: Type.Optional(Type.String()),
  options: Type.Array(DropdownOption),
  error: Type.Optional(Type.String()),
});

export type DropdownState<T> = {
  disabled?: boolean;
  placeholder?: string;
  options: DropdownOption<T>[];
  error?: string;
};
