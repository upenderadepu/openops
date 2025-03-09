import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { SplitAction } from '@openops/shared';

import { SingleCondition } from './single-condition';

type ConditionsProps = {
  readonly: boolean;
  groupIndex: number;
  groupName: `settings.options.${number}.conditions`;
};

const Conditions = React.memo(
  ({ readonly, groupIndex, groupName }: ConditionsProps) => {
    const form = useFormContext<SplitAction>();
    const { fields } = useFieldArray({
      control: form.control,
      name: `${groupName}.${groupIndex}`,
    });

    return (
      <div className="flex flex-col gap-4">
        {fields.map((condition, conditionIndex) => (
          <SingleCondition
            key={condition.id}
            groupIndex={groupIndex}
            groupName={groupName}
            readonly={readonly}
            conditionIndex={conditionIndex}
          />
        ))}
      </div>
    );
  },
);

Conditions.displayName = 'Conditions';

export { Conditions };
