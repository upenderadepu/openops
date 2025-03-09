import { Button, ScrollArea, ScrollBar } from '@openops/components/ui';
import { useNavigate } from 'react-router-dom';

type Props = {
  heading: string;
  seeAllLink: string;
  seeAllText: string;
  hasData: boolean;
  children: React.ReactNode;
};

const HomeTableWrapper = ({
  heading,
  seeAllLink,
  seeAllText,
  hasData,
  children,
}: Props) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between align-baseline mb-4">
        <h2 className="text-[24px] font-bold">{heading}</h2>
        <Button
          variant="link"
          onClick={() => navigate(seeAllLink)}
          disabled={!hasData}
        >
          <span className="text-base">{seeAllText}</span>
        </Button>
      </div>
      <div className="flex flex-row">
        <ScrollArea
          className="h-[220px] w-full rounded-md border"
          type={hasData ? 'always' : 'hover'}
        >
          {children}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

HomeTableWrapper.displayName = 'HomeTableWrapper';
export { HomeTableWrapper };
