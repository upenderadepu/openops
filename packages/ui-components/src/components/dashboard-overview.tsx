import { t } from 'i18next';
import { BigNumberChart } from '../ui/big-number-chart';
import { Card } from '../ui/card';

type DasbhoardOverviewProps = {
  openOpportunitiesCount?: string;
  isLoading: boolean;
  unaddressedSavingsAmount?: string;
  unnadressedSavingsPlaceholderText?: string;
  realizedSavingsAmount?: string;
  realizedSavingsPlaceholderText?: string;
  onOpportunitiesCtaClick?: () => void;
};

const DasbhoardOverview = ({
  openOpportunitiesCount,
  unaddressedSavingsAmount,
  unnadressedSavingsPlaceholderText,
  realizedSavingsAmount,
  realizedSavingsPlaceholderText,
  onOpportunitiesCtaClick,
  isLoading,
}: DasbhoardOverviewProps) => (
  <div className="flex gap-x-10 w-full min-w-[938px]">
    <Card className="flex gap-x-4 w-2/3 py-3 px-6">
      <div className="w-full">
        <BigNumberChart
          label={t('Open opportunities')}
          value={openOpportunitiesCount}
          ctaText={t('Check opportunities')}
          onCtaClick={onOpportunitiesCtaClick}
          isLoading={isLoading}
        />
      </div>
      <div className="w-0 h-full border-l border-l-gray-200"></div>
      <div className="w-full">
        <BigNumberChart
          label={t('Unaddressed savings')}
          value={unaddressedSavingsAmount}
          placeholderText={unnadressedSavingsPlaceholderText}
          isLoading={isLoading}
        />
      </div>
    </Card>

    <Card className="w-1/3 py-3 px-6">
      <BigNumberChart
        label={t('Realized savings')}
        value={realizedSavingsAmount}
        placeholderText={realizedSavingsPlaceholderText}
        footerText={t('Last 30 days')}
        isLoading={isLoading}
      />
    </Card>
  </div>
);

DasbhoardOverview.displayName = 'DasbhoardOverview';
export { DasbhoardOverview, DasbhoardOverviewProps };
