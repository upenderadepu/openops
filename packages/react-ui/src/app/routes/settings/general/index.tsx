import { typeboxResolver } from '@hookform/resolvers/typebox';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Input,
  INTERNAL_ERROR_TOAST,
  Label,
  useToast,
} from '@openops/components/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';

import { useAuthorization } from '@/app/common/hooks/authorization-hooks';
import { projectHooks } from '@/app/common/hooks/project-hooks';
import { authenticationSession } from '@/app/lib/authentication-session';
import { projectApi } from '@/app/lib/project-api';
import { Project, ProjectMemberRole } from '@openops/shared';

export default function GeneralPage() {
  const queryClient = useQueryClient();
  const { project, updateProject } = projectHooks.useCurrentProject();
  const { role } = useAuthorization();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      displayName: project?.displayName,
    },
    disabled: role !== ProjectMemberRole.ADMIN,
    resolver: typeboxResolver(Project),
  });

  const mutation = useMutation<
    Project,
    Error,
    {
      displayName: string;
    }
  >({
    mutationFn: (request) => {
      updateProject(queryClient, request);
      return projectApi.update(authenticationSession.getProjectId()!, request);
    },
    onSuccess: () => {
      toast({
        title: t('Success'),
        description: t('Your changes have been saved.'),
        duration: 3000,
      });
    },
    onError: (error) => {
      toast(INTERNAL_ERROR_TOAST);
      console.error(error);
    },
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>{t('General')}</CardTitle>
        <CardDescription>
          {t('Manage general settings for your project.')}
        </CardDescription>
        {role !== ProjectMemberRole.ADMIN && (
          <p>
            <span className="text-destructive">*</span>{' '}
            {t('Only project admins can change this setting.')}
          </p>
        )}
      </CardHeader>
      <CardContent className="grid gap-1 mt-4">
        <Form {...form}>
          <form className="grid space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FormField
              name="displayName"
              render={({ field }) => (
                <FormItem className="grid space-y-2">
                  <Label htmlFor="displayName">{t('Project Name')}</Label>
                  <Input
                    {...field}
                    required
                    id="displayName"
                    placeholder={t('Project Name')}
                    className="rounded-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {form?.formState?.errors?.root?.serverError && (
              <FormMessage>
                {form.formState.errors.root.serverError.message}
              </FormMessage>
            )}
          </form>
        </Form>
        {role === ProjectMemberRole.ADMIN && (
          <div className="flex gap-2 justify-end mt-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                mutation.mutate(form.getValues());
              }}
            >
              {t('Save')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
