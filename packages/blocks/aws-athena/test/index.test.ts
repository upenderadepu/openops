import { awsAthena } from '../src/index';

describe('block declaration tests', () => {
  test('should return block with correct authentication', () => {
    expect(awsAthena.auth).toMatchObject({
      props: {
        accessKeyId: {
          required: true,
          type: 'SECRET_TEXT',
        },
        secretAccessKey: {
          required: true,
          type: 'SECRET_TEXT',
        },
        defaultRegion: {
          required: true,
          type: 'SHORT_TEXT',
        },
      },
    });
  });

  test('should return block with correct number of actions', () => {
    expect(Object.keys(awsAthena.actions()).length).toBe(1);
    expect(awsAthena.actions()).toMatchObject({
      athena_query: {
        name: 'athena_query',
        requireAuth: true,
      },
    });
  });
});
