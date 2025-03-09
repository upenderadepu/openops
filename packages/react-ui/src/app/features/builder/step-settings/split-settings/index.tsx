import {
  Button,
  Form,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from '@openops/components/ui';
import { t } from 'i18next';
import { CircleXIcon, PlusCircleIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { memo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  BranchOperator,
  SplitAction,
  SplitOption,
  ValidBranchCondition,
} from '@openops/shared';

import { Conditions } from './conditions';
import { EditBranchName } from './edit-branch-name';
import {
  MAX_BRANCHES,
  MIN_BRANCHES,
  canAdd,
  canDelete,
  getNextName,
} from './utils';

type SplitSettingsProps = {
  readonly: boolean;
};

const emptyCondition: ValidBranchCondition = {
  firstValue: '',
  secondValue: '',
  operator: BranchOperator.TEXT_CONTAINS,
  caseSensitive: false,
};

const emptyOption: Omit<SplitOption, 'id'> = {
  name: '',
  conditions: [[emptyCondition]],
};

const SplitSettings = memo(({ readonly }: SplitSettingsProps) => {
  const form = useFormContext<SplitAction>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'settings.options',
    keyName: 'key',
  });

  const getOptions = () => form.getValues().settings.options;

  const onAdd = () => {
    const options = getOptions();

    if (canAdd(options)) {
      append({
        ...emptyOption,
        id: nanoid(),
        name: getNextName(options),
      });
    }
  };

  const onDelete = (index: number) => {
    const { settings } = form.getValues();

    if (canDelete(getOptions(), settings.defaultBranch, index)) {
      remove(index);
    }
  };

  const deleteDisabled = getOptions().length <= MIN_BRANCHES;

  return (
    <Form {...form}>
      <div className="flex flex-col gap-2">
        {fields.map((option, optionIndex) => {
          const isDefault =
            option.id === form.getValues().settings.defaultBranch;
          const deleteButtonDisabled = readonly || isDefault || deleteDisabled;

          return (
            <div
              key={option.key}
              className={cn({
                'mt-1': optionIndex > 0,
              })}
            >
              <div className="flex align-center justify-between">
                <EditBranchName
                  name={option.name}
                  formInputName={`settings.options.${optionIndex}.name`}
                  readonly={readonly}
                  isDefault={isDefault}
                />
                {!isDefault && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="text-black relative group"
                        variant={'transparent'}
                        disabled={deleteButtonDisabled}
                        onClick={() => onDelete(optionIndex)}
                      >
                        <CircleXIcon className="h-4 w-4 " />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={5}>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm">{t('Remove branch')}</div>
                        <div className="text-xs text-muted-foreground">
                          {t('This branch will be removed.')}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {!isDefault && (
                <Conditions
                  groupName={`settings.options.${optionIndex}.conditions`}
                  readonly={readonly}
                  groupIndex={0} // have one conditions per branch at first
                />
              )}
            </div>
          );
        })}
        <div className="flex align-center">
          <Button
            className="text-blue-500 pl-1"
            variant={'transparent'}
            disabled={readonly || getOptions().length >= MAX_BRANCHES}
            onClick={onAdd}
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" /> {t('Add new')}
          </Button>
        </div>
      </div>
    </Form>
  );
});

SplitSettings.displayName = 'SplitSettings';
export { SplitSettings };
