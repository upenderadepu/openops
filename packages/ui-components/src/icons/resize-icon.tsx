import { LucideProps } from 'lucide-react';

const ResizeIcon = ({
  width = 18,
  height = 18,
  color = 'currentColor',
  strokeWidth = 1.5,
  ...props
}: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      {...props}
    >
      <path
        d="M2 10L10 2"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M7.5 10L10.5 7"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

ResizeIcon.displayName = 'ResizeIcon';
export default ResizeIcon;
