import * as crypto from 'crypto';

function hashObject(
  object: object,
  replacer?: (key: string, value: unknown) => unknown,
): string {
  const jsonString = JSON.stringify(object, replacer);
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}

export const hashUtils = {
  hashObject,
};
