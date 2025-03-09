import { Property, StaticDropdownProperty } from '@openops/blocks-framework';
import { IaCTool, generateIaCOptions } from './iac-tool';

const rdsPropertyNames: Record<string, Record<IaCTool, string>> = {
  InstanceClass: {
    terraform: 'instance_class',
    cloudformation: 'DBInstanceClass',
  },
};

export function getRDSProperty(
  iacTool: IaCTool,
): StaticDropdownProperty<string, true> {
  return Property.StaticDropdown({
    displayName: 'Property name',
    description: 'The property to modify.',
    required: true,
    options: {
      options: generateIaCOptions(iacTool, rdsPropertyNames),
    },
  });
}
