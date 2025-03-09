import { AppConnectionsTable } from '@/app/features/connections/components/connection-table';
import { NewConnectionTypeDialog } from '@/app/features/connections/components/new-connection-type-dialog';
import { useState } from 'react';

export default function AppConnectionsPage() {
  const [openNewConnectionDialog, setOpenNewConnectionDialog] = useState(false);

  return (
    <>
      <NewConnectionTypeDialog
        open={openNewConnectionDialog}
        setOpen={setOpenNewConnectionDialog}
      ></NewConnectionTypeDialog>
      <AppConnectionsTable></AppConnectionsTable>
    </>
  );
}
