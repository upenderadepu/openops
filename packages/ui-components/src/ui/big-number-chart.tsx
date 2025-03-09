import { Skeleton } from './skeleton';

type BigNumberChartProps = {
  /* Will be displayed as a label */
  label: string;
  /* Will be displayed as a value if provided, otherwise '--' will be displayed */
  value?: string;
  /* If provided, it will be displayed as a footer text */
  footerText?: string;
  /* If provided, a call to action button will be displayed if a value is also provided */
  ctaText?: string;
  /* If provided, it will invoke callback function when clicking the CTA link */
  onCtaClick?: () => void;
  /* Can be used to show a placeholder text when no value is available */
  placeholderText?: string;
  /* If provided, it will display a loading Skeleton */
  isLoading?: boolean;
};

const LoadingContent = () => (
  <>
    <Skeleton className="w-full h-10" />
    <Skeleton className="w-full h-6" />
  </>
);

const ChartContent = ({
  value,
  ctaText,
  onCtaClick,
  footerText,
  placeholderText,
}: Omit<BigNumberChartProps, 'isLoading' | 'label'>) => (
  <>
    <div className="self-stretch text-2xl font-bold ">{value || '--'}</div>
    {!!value && (
      <>
        {!!ctaText && (
          <div
            className="text-indigo-500 text-sm font-bold cursor-pointer select-none"
            role="link"
            onClick={onCtaClick}
          >
            {ctaText}
          </div>
        )}

        {!!footerText && (
          <span className="min-w-52 text-gray-500 text-lg font-normal">
            {footerText}
          </span>
        )}
      </>
    )}
    {!value && (
      <span className="min-w-52 text-gray-500 text-lg italic font-medium">
        {placeholderText}
      </span>
    )}
  </>
);

/*
 * BigNumberChart component
 */
const BigNumberChart = ({
  label,
  value,
  footerText,
  ctaText,
  onCtaClick,
  placeholderText,
  isLoading = false,
}: BigNumberChartProps) => (
  <div className="flex-col justify-start items-start gap-2 inline-flex w-full min-h-[108px]">
    <div className="min-w-48 text-lg font-normal">{label}</div>

    {isLoading ? (
      <LoadingContent />
    ) : (
      <ChartContent
        value={value}
        ctaText={ctaText}
        onCtaClick={onCtaClick}
        footerText={footerText}
        placeholderText={placeholderText}
      />
    )}
  </div>
);

BigNumberChart.displayName = 'BigNumberChart';
export { BigNumberChart, BigNumberChartProps };
