import { Type } from '@sinclair/typebox';
import { t } from 'i18next';

export const FOLDER_EXISTS_MSG = t('The folder name already exists.');

export const FolderFormSchema = Type.Object({
  displayName: Type.String({
    minLength: 1,
    pattern: '^(?!uncategorized$|Uncategorized$).*',
    errorMessage: {
      minLength: t('Please enter folder name'),
      pattern: FOLDER_EXISTS_MSG,
    },
  }),
});
