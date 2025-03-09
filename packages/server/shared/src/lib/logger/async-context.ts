import { AsyncLocalStorage } from 'async_hooks';

const GLOBAL_KEY = Symbol.for('LOGGING_ASYNC_LOCAL_STORAGE');

function getOrCreateAsyncLocalStorage(): AsyncLocalStorage<
  Record<string, string>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(global as any)[GLOBAL_KEY]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any)[GLOBAL_KEY] = new AsyncLocalStorage<
      Record<string, string>
    >();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (global as any)[GLOBAL_KEY];
}

const globalAsyncLocalStorage = getOrCreateAsyncLocalStorage();

export async function runWithLogContext<T>(
  context: Record<string, string>,
  fn: () => Promise<T>,
): Promise<T> {
  return globalAsyncLocalStorage.run(context, async () => {
    return fn();
  });
}

export async function runWithTemporaryContext<U>(
  context: Record<string, string>,
  fn: () => Promise<U>,
): Promise<U> {
  const logContext = {
    ...getContext(),
    ...context,
  };

  return runWithLogContext(logContext, async () => {
    return fn();
  });
}

export function getContext(): Record<string, string> {
  const store = globalAsyncLocalStorage.getStore();
  return store ? { ...store } : {};
}

export function appendToContext(data: Record<string, string>): void {
  const context = globalAsyncLocalStorage.getStore();
  if (context) {
    Object.assign(context, data);
  }
}
