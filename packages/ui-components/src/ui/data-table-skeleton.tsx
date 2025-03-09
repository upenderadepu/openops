import { Skeleton } from './skeleton';

interface Props {
  skeletonRowCount?: number;
}

export function DataTableSkeleton({ skeletonRowCount = 10 }: Props) {
  return (
    <div>
      <div
        className="p-2"
        role="progressbar"
        aria-valuetext="Loading..."
        aria-busy="true"
      >
        {Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
          <TableRowSkeleton key={rowIndex} />
        ))}
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div
      className="w-full h-10 bg-gray-100 mb-4 dark:bg-gray-800 rounded-sm"
      data-testid="header-cell"
    >
      <Skeleton className="w-full" />
    </div>
  );
}
