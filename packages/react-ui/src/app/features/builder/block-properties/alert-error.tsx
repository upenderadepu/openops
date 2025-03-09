import { Alert, AlertDescription, cn } from '@openops/components/ui';

const AlertError = ({
  error,
  className,
}: {
  error: string;
  className?: string;
}) => (
  <Alert variant="destructive" className={cn('overflow-auto', className)}>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
);

AlertError.displayName = 'AlertError';
export { AlertError };
