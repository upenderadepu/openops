import { statusProperty } from '../../src/lib/api-filters/status-property';

describe('statusProperty', () => {
  test('should return expected property', async () => {
    const result = statusProperty();

    expect(result).toMatchObject({
      required: true,
      displayName: 'Status',
      description: 'Define what status of recommendations should be displayed.',
      type: 'STATIC_DROPDOWN',
      options: {
        options: [
          { label: 'potential_savings', value: 'potential_savings' },
          { label: 'actual_savings', value: 'actual_savings' },
          {
            label: 'potential_and_actual_savings',
            value: 'potential_and_actual_savings',
          },
          { label: 'excluded', value: 'excluded' },
          { label: 'user_actions', value: 'user_actions' },
          { label: 'custom', value: 'custom' },
        ],
      },
    });
  });
});
