export function convertToStringArrayWithValidation(
  input: unknown,
  errorMessage: string,
): [string, ...string[]] {
  const strings = Array.isArray(input) ? input : [input];

  if (!strings.every((s) => s !== null && typeof s === 'string' && s !== '')) {
    throw new Error(errorMessage + '. Passed value: ' + JSON.stringify(input));
  }

  return strings as [string, ...string[]];
}

export function convertToStringWithValidation(
  input: unknown,
  errorMessage: string,
): string {
  if (typeof input !== 'string') {
    throw new Error(errorMessage + '. Passed value: ' + JSON.stringify(input));
  }

  return input.trim();
}
