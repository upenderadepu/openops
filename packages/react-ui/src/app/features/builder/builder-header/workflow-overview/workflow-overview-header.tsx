import { Button, PopoverClose } from '@openops/components/ui';
import { t } from 'i18next';
import { BookOpen, Pencil, X } from 'lucide-react';

type WorkflowOverviewHeaderProps = {
  isDocumentationInEditMode: boolean;
  isWorkflowReadonly: boolean;
  onEditClick: () => void;
};

const WorkflowOverviewHeaderButton = ({
  isDocumentationInEditMode,
  isWorkflowReadonly,
  onEditClick,
}: WorkflowOverviewHeaderProps) => {
  if (isDocumentationInEditMode) {
    return (
      <PopoverClose className="absolute top-4 right-4">
        <X width={16} height={16} className="text-black dark:text-white"></X>
      </PopoverClose>
    );
  } else if (!isWorkflowReadonly) {
    return (
      <Button
        variant="link"
        onClick={onEditClick}
        className="text-blueAccent-300 text-base gap-0.5"
      >
        {t('Edit')}
        <Pencil height={16} width={14} />
      </Button>
    );
  } else {
    return null;
  }
};

const WorkflowOverviewHeader = ({
  isDocumentationInEditMode,
  isWorkflowReadonly,
  onEditClick,
}: WorkflowOverviewHeaderProps) => {
  return (
    <div className="w-full pl-6 pr-[14px] flex items-center justify-between">
      <div className="flex items-center justify-center gap-3">
        <BookOpen />
        <h2 className="text-primary text-2xl text-[24px]">{t('Notes')}</h2>
      </div>
      <WorkflowOverviewHeaderButton
        onEditClick={onEditClick}
        isDocumentationInEditMode={isDocumentationInEditMode}
        isWorkflowReadonly={isWorkflowReadonly}
      />
    </div>
  );
};

WorkflowOverviewHeader.displayName = 'WorkflowOverviewHeader';
export { WorkflowOverviewHeader };
