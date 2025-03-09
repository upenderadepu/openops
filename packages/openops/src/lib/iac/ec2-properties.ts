import { Property, StaticDropdownProperty } from '@openops/blocks-framework';
import { IaCTool, generateIaCOptions } from './iac-tool';

const ec2PropertyNames: Record<string, Record<IaCTool, string>> = {
  InstanceType: {
    terraform: 'instance_type',
    cloudformation: 'InstanceType',
  },
};

export function getEC2Property(
  iacTool: IaCTool,
): StaticDropdownProperty<string, true> {
  return Property.StaticDropdown({
    displayName: 'Property name',
    description: 'The property to modify.',
    required: true,
    options: {
      options: generateIaCOptions(iacTool, ec2PropertyNames),
    },
  });
}
