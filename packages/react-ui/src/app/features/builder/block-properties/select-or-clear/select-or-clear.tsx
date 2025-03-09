import { Checkbox, Label } from '@openops/components/ui';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';

export type SelectOrClearChange = 'selectAll' | 'clear';
type SelectOrClearProps = {
  selectedCount: number;
  totalCount: number;
  sendChanges: (changeType: SelectOrClearChange) => void;
};

export const SelectOrClear = ({
  selectedCount,
  totalCount,
  sendChanges,
}: SelectOrClearProps) => {
  const allSelected = selectedCount === totalCount;
  const indeterminate = selectedCount > 0 && selectedCount < totalCount;

  const dataState = allSelected
    ? true
    : indeterminate
    ? 'indeterminate'
    : false;

  const [checkedState, setCheckedState] = useState<CheckedState>(dataState);

  useEffect(() => {
    setCheckedState(dataState);
  }, [dataState]);

  const onCheckedChange = () => {
    const nextState = checkedState === 'indeterminate' ? false : !checkedState;
    sendChanges(nextState ? 'selectAll' : 'clear');
    setCheckedState(nextState);
  };

  return (
    <div className="flex justify-start items-center py-2 px-1">
      <Checkbox
        id="select-all"
        checked={checkedState}
        onCheckedChange={onCheckedChange}
      />
      <Label className="text-sm ml-2" onClick={onCheckedChange}>
        {allSelected || dataState === 'indeterminate'
          ? // todo -> i18n
            'Clear all'
          : 'Select All'}
      </Label>
    </div>
  );
};
