import { BlockAuth, createAction, Property } from '@openops/blocks-framework';

export const toMapAction = createAction({
  auth: BlockAuth.None(),
  name: 'to_map_action',
  description: 'Map items by a given key',
  displayName: 'Map list items',
  props: {
    listItems: Property.Array({
      displayName: 'Items',
      description: 'A list of items to map',
      required: true,
    }),
    keyName: Property.ShortText({
      displayName: 'Property Key',
      description: 'The property to build the map',
      required: true,
    }),
  },

  async run(context) {
    const items = context.propsValue.listItems as unknown as any;
    if (!Array.isArray(items)) {
      if (items === '') {
        return {};
      }
      throw new Error('Resources should be an array');
    }
    return toMap(items, context.propsValue.keyName);
  },
});

function toMap(array: any[], prop: string) {
  return array.reduce((dict, item) => {
    if (item[prop] !== undefined) {
      const key = item[prop];
      if (!dict[key]) {
        dict[key] = [];
      }
      dict[key].push(item);
    }
    return dict;
  }, {});
}
