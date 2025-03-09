import { ControllerRenderProps } from 'react-hook-form';

import { JsonEditor } from '@/app/common/components/json-editior';
import { textMentionUtils } from '@/app/features/builder/block-properties/text-input-with-mentions/text-input-utils';
import { useBuilderStateContext } from '@/app/features/builder/builder-hooks';

interface BuilderJsonEditorWrapperProps {
  field: ControllerRenderProps<Record<string, any>, string>;
  disabled?: boolean;
}

const BuilderJsonEditorWrapper = ({
  field,
  disabled,
}: BuilderJsonEditorWrapperProps) => {
  const [setInsertStateHandler] = useBuilderStateContext((state) => [
    state.setInsertMentionHandler,
  ]);

  return (
    <JsonEditor
      field={field}
      readonly={disabled ?? false}
      onFocus={(ref) => {
        setInsertStateHandler((propertyPath) => {
          ref.current?.view?.dispatch({
            changes: {
              from: ref.current.view.state.selection.main.head,
              insert: `{{${propertyPath}}}`,
            },
          });
        });
      }}
      className={textMentionUtils.inputThatUsesMentionClass}
    />
  );
};

BuilderJsonEditorWrapper.displayName = 'BuilderJsonEditorWrapper';
export { BuilderJsonEditorWrapper };
