import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@openops/components/ui';
import { t } from 'i18next';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';

type WorkflowOverviewProps = {
  overview?: string;
  onOverviewUpdate: (description: string) => void;
};

const WorkflowOverview = ({ overview }: WorkflowOverviewProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div className="bg-background shadow-editor flex items-center justify-center rounded-lg z-50 p-1 h-12">
          <Button
            variant={isPopoverOpen ? 'ghostActive' : 'ghost'}
            className="gap-2 p-2 text-lg font-normal"
          >
            <BookOpen />
            {t(overview ? 'Notes' : 'Add notes')}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        updatePositionStrategy="always"
        onInteractOutside={(e) => e.preventDefault()}
      ></PopoverContent>
    </Popover>
  );
};

WorkflowOverview.displayName = 'WorkflowOverview';

export { WorkflowOverview };
