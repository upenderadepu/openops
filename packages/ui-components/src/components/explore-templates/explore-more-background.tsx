import ExploreMoreBackgroungLeft from './explore-more-background-left';
import ExploreMoreBackgroungRight from './explore-more-background-right';

const ExploreMoreBackgroung = () => {
  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-between border rounded-2xl">
      <ExploreMoreBackgroungLeft />
      <ExploreMoreBackgroungRight />
    </div>
  );
};

export default ExploreMoreBackgroung;
