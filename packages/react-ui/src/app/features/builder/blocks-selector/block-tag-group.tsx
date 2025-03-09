import { BlockTag } from '@/app/features/builder/blocks-selector/block-tag';
import construction from '@/assets/img/custom/construction.png';
import link from '@/assets/img/custom/link.png';

export enum BlockTagEnum {
  CORE = 'CORE',
  APPS = 'APPS',
  ALL = 'ALL',
}

const tags: Record<
  BlockTagEnum,
  {
    title: string;
    color: 'green' | 'blue' | 'purple' | 'yellow' | 'pink';
    icon?: string;
  }
> = {
  [BlockTagEnum.ALL]: {
    title: 'All',
    color: 'blue',
  },
  [BlockTagEnum.CORE]: {
    icon: construction,
    title: 'Core',
    color: 'pink',
  },

  [BlockTagEnum.APPS]: {
    icon: link,
    title: 'Apps',
    color: 'yellow',
  },
};
type BlockTagGroupProps = {
  type: 'action' | 'trigger';
  selectedTag?: BlockTagEnum;
  onSelectTag: (tag: BlockTagEnum) => void;
};

const BlockTagGroup = ({
  selectedTag,
  onSelectTag,
  type,
}: BlockTagGroupProps) => {
  return (
    <div className="flex py-2 px-2 gap-2 items-center">
      {Object.entries(tags).map(([tag, tagData]) => (
        <BlockTag
          key={tagData.title}
          variant={tagData.color}
          onClick={(e) => {
            onSelectTag(
              selectedTag === tag ? BlockTagEnum.ALL : (tag as BlockTagEnum),
            );
            e.stopPropagation();
          }}
          selected={selectedTag === tag}
        >
          <div className="flex items-center gap-2">
            {tagData.icon && (
              <img src={tagData.icon} alt={tagData.title} className="w-4 h-4" />
            )}
            {tagData.title}
          </div>
        </BlockTag>
      ))}
    </div>
  );
};

BlockTagGroup.displayName = 'BlockTagGroup';
export { BlockTagGroup };
