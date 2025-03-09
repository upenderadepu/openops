export async function waitForConditionWithTimeout(
  condition: () => Promise<boolean>,
  delay: number,
  timeoutInSeconds: number,
  timeoutReachedMessage?: string,
): Promise<void> {
  const timeoutInMs = timeoutInSeconds * 1000;
  const startTime = Date.now();

  do {
    const result = await condition();
    if (result) return;

    await new Promise((r) => setTimeout(r, delay));
  } while (Date.now() - startTime < timeoutInMs);

  throw new Error(
    `Timed out after ${timeoutInSeconds} seconds. ${
      timeoutReachedMessage ? `With message: ${timeoutReachedMessage}` : ''
    }`,
  );
}
