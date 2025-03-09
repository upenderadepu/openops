import { lazy, Suspense } from 'react';

import { Skeleton } from '../../ui/skeleton';

import { type BuilderTreeViewProps } from './builder-tree-view';

const LazyBuilderTreeView = lazy(() =>
  import('./builder-tree-view').then((module) => ({
    default: module.BuilderTreeView,
  })),
);

export function BuilderTreeView(props: BuilderTreeViewProps) {
  return (
    <Suspense fallback={<TreeViewSkeleton />}>
      <LazyBuilderTreeView {...props} />
    </Suspense>
  );
}

const TreeViewSkeleton = () => (
  <div className="space-y-4 p-8">
    {Array.from({ length: 8 }).map((_, index) => (
      <Skeleton key={index} className="w-full h-full p-4" />
    ))}
  </div>
);

export { BuilderTreeViewProvider } from './builder-tree-view-context';
