import { FlowTemplateMetadataWithIntegrations } from '@openops/components/ui';
import { FlowTemplateDto } from '@openops/shared';
import { useCallback, useState } from 'react';

export const useSelectFlowTemplateDialog = (
  initialSelectedTemplateMetadata?: FlowTemplateMetadataWithIntegrations,
) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    FlowTemplateDto | undefined
  >();
  const [selectedTemplateMetadata, setSelectedTemplateMetadata] = useState<
    FlowTemplateMetadataWithIntegrations | undefined
  >(initialSelectedTemplateMetadata);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnectionsPickerOpen, setIsConnectionsPickerOpen] = useState(false);

  const resetTemplateDialog = useCallback(() => {
    setSelectedTemplate(undefined);
    setSelectedTemplateMetadata(initialSelectedTemplateMetadata);
    setIsExpanded(false);
    setIsConnectionsPickerOpen(false);
  }, [initialSelectedTemplateMetadata]);

  return {
    isConnectionsPickerOpen,
    setIsConnectionsPickerOpen,
    selectedTemplate,
    setSelectedTemplate,
    selectedTemplateMetadata,
    setSelectedTemplateMetadata,
    isExpanded,
    setIsExpanded,
    resetTemplateDialog,
  };
};
