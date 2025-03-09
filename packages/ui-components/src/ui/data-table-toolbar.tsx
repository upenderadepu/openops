type DataTableToolbarProps = {
  children?: React.ReactNode;
};

const DataTableToolbar = ({ children }: DataTableToolbarProps) => {
  if (!children) return null;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-1 items-center space-x-2">{children}</div>
    </div>
  );
};
DataTableToolbar.displayName = 'DataTableToolbar';

export { DataTableToolbar };
