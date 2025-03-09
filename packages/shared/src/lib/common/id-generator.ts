import { Static, Type } from '@sinclair/typebox';
import { customAlphabet } from 'nanoid';

const ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ID_LENGTH = 21;

export const OpenOpsId = Type.String({
  pattern: `^[0-9a-zA-Z]{${ID_LENGTH}}$`,
});

export type OpenOpsId = Static<typeof OpenOpsId>;

export const openOpsId = customAlphabet(ALPHABET, ID_LENGTH);

export const secureOpenOpsId = (length: number) =>
  customAlphabet(ALPHABET, length)();
