export function getAzureErrorMessage(error: unknown): string {
  try {
    if (error instanceof Error) {
      const parsedError = JSON.parse(error.message);
      return parsedError.error_description || String(error.message);
    }
    return String(error);
  } catch {
    return error instanceof Error ? error.message : String(error);
  }
}
