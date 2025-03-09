import { listOperations } from '../src/index';

describe('block declaration tests', () => {
  test('should return block with correct number of actions', () => {
    expect(Object.keys(listOperations.actions()).length).toBe(3);
    expect(listOperations.actions()).toMatchObject({
      group_by_action: {
        name: 'group_by_action',
      },
      extract_from_list_action: {
        name: 'extract_from_list_action',
      },
      to_map_action: {
        name: 'to_map_action',
      },
    });
  });
});
