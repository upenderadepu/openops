import { t } from 'i18next';
import { ErrorInfo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { TreeViewSideBar } from './tree-view-sidebar';

const logError = (error: Error, info: ErrorInfo) => {
  console.error(error, info);
};

const TreeView = () => {
  return (
    <ErrorBoundary
      fallback={<div className="p-4">{t('Some error occurred...')}</div>}
      onError={logError}
    >
      <TreeViewSideBar />
    </ErrorBoundary>
  );
};

TreeView.displayName = 'TreeView';
export { TreeView };
