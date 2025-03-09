import { Skeleton } from '@openops/components/ui';

export const LoadingSkeleton = () => (
  <div className="flex flex-col gap-2 px-6 py-2">
    {Array.from(Array(5)).map((_, index) => (
      <Skeleton key={index} className="rounded-md w-full h-8" />
    ))}
  </div>
);
