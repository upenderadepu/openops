import { buttonVariants, cn } from '@openops/components/ui';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLayoutProps {
  items: SidebarItem[];
  children: React.ReactNode;
}

type SidebarItem = {
  title: string;
  href: string;
  icon: JSX.Element;
};

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarItem[];
}

function SidebarItem({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            location.pathname.toLowerCase() === item.href.toLowerCase()
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}
        >
          <div className="flex items-center justify-center gap-2">
            {item.icon}
            {item.title}
          </div>
        </Link>
      ))}
    </nav>
  );
}

export default function SidebarLayout({ items, children }: SidebarLayoutProps) {
  return (
    <div className="w-full hidden md:block">
      <div className="px-7">
        <Separator className="my-3" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarItem items={items} />
          </aside>
          <div className="w-full flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
