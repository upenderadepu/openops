import { FOLDER_ID_PARAM_NAME } from '@openops/components/ui';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const useUpdateSearchParams = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(location.search);
  const navigate = useNavigate();

  return (folderId: string | undefined, navigateToFlows = false) => {
    const newQueryParameters: URLSearchParams = new URLSearchParams(
      searchParams,
    );
    if (folderId) {
      newQueryParameters.set(FOLDER_ID_PARAM_NAME, folderId);
    } else {
      newQueryParameters.delete(FOLDER_ID_PARAM_NAME);
    }
    newQueryParameters.delete('cursor');

    if (navigateToFlows) {
      navigate(`/flows?${newQueryParameters}`);
    } else {
      setSearchParams(newQueryParameters);
    }
  };
};

export { useUpdateSearchParams };
