import React from 'react';

import { AutoPropertiesFormComponent } from '@/app/features/builder/block-properties/auto-properties-form';
import { CustomAuthProperty } from '@openops/blocks-framework';

type CustomAuthConnectionSettingsProps = {
  authProperty: CustomAuthProperty<any>;
};

const CustomAuthConnectionSettings = React.memo(
  ({ authProperty }: CustomAuthConnectionSettingsProps) => {
    return (
      <AutoPropertiesFormComponent
        prefixValue="request.value.props"
        props={authProperty.props}
        useMentionTextInput={false}
        allowDynamicValues={false}
      />
    );
  },
);

CustomAuthConnectionSettings.displayName = 'CustomAuthConnectionSettings';
export { CustomAuthConnectionSettings };
