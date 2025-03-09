import { BlockAuth, createAction, Property } from '@openops/blocks-framework';

export const extractFromListAction = createAction({
  auth: BlockAuth.None(),
  name: 'extract_from_list_action',
  description: 'Extract items from a list with a given key',
  displayName: 'Extract From List',
  props: {
    listItems: Property.Array({
      displayName: 'Items',
      description: `A list of items to extract from`,
      required: true,
    }),
    keyName: Property.ShortText({
      displayName: 'Property Key',
      description: 'The property to extract',
      required: true,
    }),
  },

  async run(context) {
    const listItems = getItems(context) as any[];

    if (!listItems.length) {
      return [];
    }

    return listItems.map((item) => {
      if (!(context.propsValue.keyName in item)) {
        throw new Error(
          `Item does not have property: ${context.propsValue.keyName}`,
        );
      }

      return item[context.propsValue.keyName];
    });
  },
});

function getItems(context: any) {
  const { listItems } = context.propsValue;
  if (!Array.isArray(listItems)) {
    throw new Error('Given input is not an array');
  }
  const isObjectEmpty = (obj: object) => Object.keys(obj).length === 0;
  return listItems.every(isObjectEmpty) ? [] : listItems;
}
