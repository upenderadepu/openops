import { removeActionBlocks } from '../src/lib/common/message-interactions';

describe('removeActionBlocks', () => {
  test('should do nothing when given blocks are empty', () => {
    const blocks: any[] = [];

    const result = removeActionBlocks(blocks);

    expect(result).toEqual([]);
  });

  test('should remove actions blocks', () => {
    const expectedBlock = {
      type: 'section',
      text: {
        type: 'plain_text',
        text: 'This is a plain text section block.',
        emoji: true,
      },
    };
    const blocks = [
      expectedBlock,
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Click Me', emoji: true },
            value: 'click_me_123',
            action_id: 'actionId-0',
          },
          {
            type: 'conversations_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select a conversation',
              emoji: true,
            },
            action_id: 'actionId-1',
          },
        ],
      },
    ];

    const result = removeActionBlocks(blocks);

    expect(result.length).toEqual(1);
    expect(result).toStrictEqual([expectedBlock]);
  });

  test('should remove accessory property if it is not an image', () => {
    const expectedBlock = {
      text: { text: 'Owner', type: 'mrkdwn' },
      type: 'section',
      accessory: {
        type: 'static_select',
        options: [
          { text: { text: 'Approve', type: 'plain_text' }, value: 'Approve' },
          { text: { text: 'Dismiss', type: 'plain_text' }, value: 'Dismiss' },
          {
            text: { text: 'Remind me later', type: 'plain_text' },
            value: 'Remind me later',
          },
        ],
        placeholder: { text: 'Select an item', type: 'plain_text' },
      },
    };
    const blocks = [
      expectedBlock,
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Click Me', emoji: true },
            value: 'click_me_123',
            action_id: 'actionId-0',
          },
        ],
      },
    ];

    const result = removeActionBlocks(blocks);

    expect(result.length).toEqual(1);
    expect(result[0].accessory).toBeUndefined();
    expect(result[0].text).toStrictEqual(expectedBlock.text);
    expect(result[0].type).toStrictEqual(expectedBlock.type);
  });

  test('should keep accessory property if it is an image', () => {
    const expectedBlock = {
      text: { text: 'Owner', type: 'mrkdwn' },
      type: 'section',
      accessory: {
        type: 'image',
        image_url:
          'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
        alt_text: 'Approve',
      },
    };
    const blocks = [
      expectedBlock,
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Click Me', emoji: true },
            value: 'click_me_123',
            action_id: 'actionId-0',
          },
        ],
      },
    ];

    const result = removeActionBlocks(blocks);

    expect(result.length).toEqual(1);
    expect(result[0].accessory).toBeDefined();
    expect(result[0].accessory.type).toBe('image');
    expect(result[0].text).toStrictEqual(expectedBlock.text);
    expect(result[0].type).toStrictEqual(expectedBlock.type);
  });

  test('should do nothing when there are no button blocks', () => {
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'This is a plain text section block.',
          emoji: true,
        },
      },
    ];

    const result = removeActionBlocks(blocks);

    expect(result.length).toEqual(1);
    expect(result).toStrictEqual(blocks);
  });
});
