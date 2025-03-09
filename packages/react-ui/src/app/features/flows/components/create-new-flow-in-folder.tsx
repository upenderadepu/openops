import { FOLDER_ID_PARAM_NAME, NewFlowButton } from '@openops/components/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { flowsHooks } from '@/app/features/flows/lib/flows-hooks';
import { useCallback } from 'react';

const CreateNewFlowInFolder = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const { mutate: createFlow, isPending: isCreateFlowPending } =
    flowsHooks.useCreateFlow(navigate);

  const onClickHandler = useCallback(() => {
    const folderId = searchParams.get(FOLDER_ID_PARAM_NAME) || undefined;
    createFlow(folderId);
  }, [createFlow, searchParams]);

  return (
    <NewFlowButton loading={isCreateFlowPending} onClick={onClickHandler} />
  );
};

CreateNewFlowInFolder.displayName = 'CreateNewFlowInFolder';

export { CreateNewFlowInFolder };
