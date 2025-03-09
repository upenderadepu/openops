import { t } from 'i18next';
import { cn } from '../../lib/cn';
import { BlockIconList } from '../block-icon/block-icon-list';
import { TemplateCardText } from './template-card-text';
import { FlowTemplateMetadataWithIntegrations } from './types';
type SampleTemplateCardProps = {
  templateMetadata: FlowTemplateMetadataWithIntegrations;
  onClick: () => void;
};

const SampleTemplateCard = ({
  templateMetadata,
  onClick,
}: SampleTemplateCardProps) => (
  <div
    onClick={onClick}
    className={cn(
      'w-full h-[169px] p-4 pl-[22px] flex flex-col gap-[7px] bg-background rounded-sm border text-black dark:text-white cursor-pointer overflow-hidden',
      {
        'bg-secondary': !templateMetadata,
      },
    )}
    data-testid="get-started-template-card"
  >
    {templateMetadata && (
      <>
        <div className="flex justify-between gap-1">
          <BlockIconList
            size="lg"
            metadata={templateMetadata.integrations}
            maxNumberOfIconsToShow={2}
          />
          <div className="flex justify-center items-center bg-success-100 text-success-300 h-[27px] text-[13px] font-bold rounded px-2 text-nowrap">
            {t('Sample template')}
          </div>
        </div>
        <TemplateCardText
          templateMetadata={templateMetadata}
          headerMaxLines={1}
          totalMaxLines={3}
        />
      </>
    )}
  </div>
);
SampleTemplateCard.displayName = 'SampleTemplateCard';
export { SampleTemplateCard };
