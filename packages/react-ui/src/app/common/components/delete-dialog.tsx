import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  toast,
} from '@openops/components/ui';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import React, { useState } from 'react';

type ConfirmationDeleteDialogProps = {
  title: string | React.ReactNode;
  message: React.ReactNode;
  children: React.ReactNode;
  entityName: string;
  className?: string;
  content?: React.ReactNode;
  mutationFn: () => Promise<void>;
  onError?: (error: Error) => void;
};

export function ConfirmationDeleteDialog({
  children,
  message,
  title,
  mutationFn,
  entityName,
  className,
  content,
  onError,
}: ConfirmationDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, mutate } = useMutation({
    mutationFn,
    onSuccess: () => {
      toast({
        title: t('Removed {entityName}', { entityName }),
      });
      setIsOpen(false);
    },
    onError,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button
            variant={'outline'}
            className="w-[136px] h-12 px-4 py-3 text-base"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            loading={isPending}
            variant={'destructive'}
            className="w-[136px] h-12 px-4 py-3  text-base"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              mutate();
            }}
          >
            {t('Delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
