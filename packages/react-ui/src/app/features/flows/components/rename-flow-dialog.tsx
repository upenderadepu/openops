import { typeboxResolver } from '@hookform/resolvers/typebox';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Input,
  INTERNAL_ERROR_TOAST,
  Label,
  toast,
} from '@openops/components/ui';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Static, Type } from '@sinclair/typebox';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { flowsApi } from '@/app/features/flows/lib/flows-api';
import { useRefetchFolderTree } from '@/app/features/folders/hooks/refetch-folder-tree';
import { FlowOperationType, PopulatedFlow } from '@openops/shared';

const RenameFlowSchema = Type.Object({
  displayName: Type.String(),
});

type RenameFlowSchema = Static<typeof RenameFlowSchema>;

type RenameFlowDialogProps = {
  children: React.ReactNode;
  flowId: string;
  currentName: string;
  onRename: (newName: string) => void;
};
const RenameFlowDialog: React.FC<RenameFlowDialogProps> = ({
  children,
  flowId,
  onRename,
  currentName,
}) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const renameFlowForm = useForm<RenameFlowSchema>({
    resolver: typeboxResolver(RenameFlowSchema),
    defaultValues: {
      displayName: currentName,
    },
  });

  const refetchFolderTree = useRefetchFolderTree();

  const { mutate, isPending } = useMutation<
    PopulatedFlow,
    Error,
    {
      flowId: string;
      displayName: string;
    }
  >({
    mutationFn: () =>
      flowsApi.update(flowId, {
        type: FlowOperationType.CHANGE_NAME,
        request: renameFlowForm.getValues(),
      }),
    onSuccess: () => {
      setIsRenameDialogOpen(false);
      refetchFolderTree();
      onRename(renameFlowForm.getValues().displayName);
      toast({
        title: t('Success'),
        description: t('Workflow has been renamed.'),
        duration: 3000,
      });
    },
    onError: () => toast(INTERNAL_ERROR_TOAST),
  });

  return (
    <Dialog
      open={isRenameDialogOpen}
      onOpenChange={(open) => setIsRenameDialogOpen(open)}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Rename Workflow')}</DialogTitle>
        </DialogHeader>
        <Form {...renameFlowForm}>
          <form
            className="grid space-y-4"
            onSubmit={renameFlowForm.handleSubmit((data) =>
              mutate({
                flowId,
                displayName: data.displayName,
              }),
            )}
          >
            <FormField
              control={renameFlowForm.control}
              name="displayName"
              render={({ field }) => (
                <FormItem className="grid space-y-2">
                  <Label htmlFor="displayName">{t('Name')}</Label>
                  <Input
                    {...field}
                    id="displayName"
                    placeholder={t('New Workflow Name')}
                    className="rounded-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {renameFlowForm?.formState?.errors?.root?.serverError && (
              <FormMessage>
                {renameFlowForm.formState.errors.root.serverError.message}
              </FormMessage>
            )}
            <Button loading={isPending}>{t('Confirm')}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { RenameFlowDialog };
