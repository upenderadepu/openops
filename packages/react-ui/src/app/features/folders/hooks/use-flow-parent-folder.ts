import { FolderItem } from '@openops/components/ui';
import { useParams } from 'react-router-dom';
import { findSelectedFlowParentFolder } from '../lib/folders-utils';

const useFlowParentFolder = (folderItems: FolderItem[] | undefined) => {
  const { flowId } = useParams();
  if (!flowId) {
    return undefined;
  }

  return findSelectedFlowParentFolder(folderItems, flowId);
};
export { useFlowParentFolder };
