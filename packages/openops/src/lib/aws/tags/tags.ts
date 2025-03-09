import { Property } from '@openops/blocks-framework';

export function filterTagsProperties() {
  return {
    tags: Property.Array({
      displayName: 'Tags',
      required: false,
      properties: {
        name: Property.LongText({
          displayName: 'Tag Name',
          required: true,
        }),
        pattern: Property.LongText({
          displayName: 'Regex Pattern',
          required: true,
        }),
      },
    }),
    condition: Property.StaticDropdown({
      displayName: 'Tag Filter Condition',
      description: 'Condition to apply to the tags',
      required: false,
      options: {
        disabled: false,
        options: [
          { label: 'AND', value: 'AND' },
          { label: 'OR', value: 'OR' },
        ],
      },
      defaultValue: 'AND',
    }),
  };
}

export interface AwsTag {
  Key: string;
  Value: string;
}
export interface SearchTag {
  name: string;
  pattern: string;
}

export function filterTags(
  tags: AwsTag[],
  searchTags: SearchTag[],
  condition?: string,
) {
  const isTagMatched = (searchTag: SearchTag) => {
    const regexPattern = new RegExp(searchTag.pattern);
    return tags.some(
      (resourceTag) =>
        resourceTag.Key === searchTag.name &&
        regexPattern.test(resourceTag.Value),
    );
  };

  return condition === 'OR'
    ? searchTags.some((searchTag) => isTagMatched(searchTag))
    : searchTags.every((searchTag) => isTagMatched(searchTag));
}
