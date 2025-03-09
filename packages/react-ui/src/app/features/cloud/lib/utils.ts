export const getProjectIdSearchParam = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    projectId: params.get('projectId'),
    userId: params.get('userId'),
  };
};
