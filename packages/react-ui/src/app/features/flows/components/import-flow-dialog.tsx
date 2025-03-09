import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  INTERNAL_ERROR_TOAST,
  toast,
} from '@openops/components/ui';
import {
  FlowImportTemplate,
  FlowOperationType,
  PopulatedFlow,
} from '@openops/shared';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { flowsApi } from '../lib/flows-api';

import { userSettingsHooks } from '@/app/common/hooks/user-settings-hooks';
import { SEARCH_PARAMS } from '@/app/constants/search-params';
import { authenticationSession } from '@/app/lib/authentication-session';

const ImportFlowDialog = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateHomePageOperationalViewFlag } =
    userSettingsHooks.useHomePageOperationalView();

  const { mutate: createFlow, isPending } = useMutation<
    PopulatedFlow,
    Error,
    FlowImportTemplate
  >({
    mutationFn: async (template: FlowImportTemplate) => {
      const newFlow = await flowsApi.create({
        displayName: template.name,
        projectId: authenticationSession.getProjectId()!,
      });
      return await flowsApi.update(newFlow.id, {
        type: FlowOperationType.IMPORT_FLOW,
        request: {
          displayName: template.name,
          description: template.template.description,
          trigger: template.template.trigger,
        },
      });
    },
    onSuccess: (flow) => {
      updateHomePageOperationalViewFlag();
      navigate(`/flows/${flow.id}?${SEARCH_PARAMS.viewOnly}=true`);
    },
    onError: () => {
      toast(INTERNAL_ERROR_TOAST);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const template = JSON.parse(
          reader.result as string,
        ) as FlowImportTemplate;
        // TODO handle overwriting flow when using actions in builder
        createFlow(template);
      } catch (error) {
        toast(INTERNAL_ERROR_TOAST);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Import Workflow')}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            data-testid="importFlowFileInput"
          />
          <Button
            onClick={handleSubmit}
            loading={isPending}
            data-testid="importFlowButton"
          >
            {t('Import')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ImportFlowDialog };
