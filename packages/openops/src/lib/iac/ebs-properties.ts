import { Property, StaticDropdownProperty } from '@openops/blocks-framework';
import { IaCTool, generateIaCOptions } from './iac-tool';

const ebsIacPropertyNames: Record<string, Record<IaCTool, string>> = {
  VolumeType: {
    terraform: 'volume_type',
    cloudformation: 'VolumeType',
  },
  Size: {
    terraform: 'size',
    cloudformation: 'Size',
  },
  Iops: {
    terraform: 'iops',
    cloudformation: 'Iops',
  },
};

export function getEBSProperty(
  iacTool: IaCTool,
): StaticDropdownProperty<string, true> {
  return Property.StaticDropdown({
    displayName: 'Property name',
    description: 'The property to modify.',
    required: true,
    options: {
      options: generateIaCOptions(iacTool, ebsIacPropertyNames),
    },
  });
}
