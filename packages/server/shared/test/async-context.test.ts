import {
  getContext,
  runWithLogContext,
  runWithTemporaryContext,
} from '../src/lib/logger/async-context';

describe('async-context', () => {
  test('should maintain context for each operation independently', async () => {
    const results = await Promise.all([
      runWithLogContext({ requestId: 'req1' }, async () => {
        const context = getContext();
        expect(context).toEqual({ requestId: 'req1' });
        await new Promise((resolve) => setTimeout(resolve, 50));
        return getContext();
      }),
      runWithLogContext({ requestId: 'req2' }, async () => {
        const context = getContext();
        expect(context).toEqual({ requestId: 'req2' });
        await new Promise((resolve) => setTimeout(resolve, 30));
        return getContext();
      }),
    ]);

    expect(results).toEqual([{ requestId: 'req1' }, { requestId: 'req2' }]);
  });

  test('should append to context and isolate changes', async () => {
    await runWithLogContext({ userId: 'user1' }, async () => {
      const contextBefore = getContext();
      expect(contextBefore).toEqual({ userId: 'user1' });

      await runWithTemporaryContext({ sessionId: 'session1' }, async () => {
        const contextDuring = getContext();
        expect(contextDuring).toEqual({
          userId: 'user1',
          sessionId: 'session1',
        });
      });

      const contextAfter = getContext();
      expect(contextAfter).toEqual({ userId: 'user1' }); // sessionId should be removed
    });
  });

  test('should handle concurrent temporary contexts', async () => {
    const results = await Promise.all([
      runWithLogContext({ userId: 'userA' }, async () => {
        return runWithTemporaryContext({ tempKey: 'temp1' }, async () => {
          await new Promise((resolve) => setTimeout(resolve, 40));
          return getContext();
        });
      }),
      runWithLogContext({ userId: 'userB' }, async () => {
        return runWithTemporaryContext({ tempKey: 'temp2' }, async () => {
          await new Promise((resolve) => setTimeout(resolve, 20));
          return getContext();
        });
      }),
    ]);

    expect(results).toEqual([
      { userId: 'userA', tempKey: 'temp1' },
      { userId: 'userB', tempKey: 'temp2' },
    ]);
  });

  test('should remove keys from context after temporary context', async () => {
    await runWithLogContext({ key1: 'value1' }, async () => {
      await runWithTemporaryContext(
        { key2: 'tempValue2', key3: 'tempValue3', key1: 'value2' },
        async () => {
          const contextDuring = getContext();
          expect(contextDuring).toEqual({
            key1: 'value2',
            key2: 'tempValue2',
            key3: 'tempValue3',
          });
        },
      );

      const contextAfter = getContext();
      expect(contextAfter).toEqual({ key1: 'value1' });
    });
  });
});
