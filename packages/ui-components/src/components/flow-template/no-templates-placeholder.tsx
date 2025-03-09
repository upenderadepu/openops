import { t } from 'i18next';
import { Search as SearchIcon } from 'lucide-react';

export const NoTemplatesPlaceholder = () => (
  <div className="flex flex-col flex-1 items-center justify-center text-center text-primary-300">
    <SearchIcon />
    <span className="font-bold mt-4">
      {t("Oops! We couldn't find anything.")}
    </span>
    <span className="text-sm mt-0.5">
      {t('Try adjusting your search term or use the filters')}
    </span>
  </div>
);
