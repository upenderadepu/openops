import { LucideProps } from 'lucide-react';

const TriggerIcon = ({
  width = 18,
  height = 18,
  color = 'currentColor',
  strokeWidth = 1.5,
  ...props
}: LucideProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.5 10.5L6.75 1.5V7.5H10.5L5.25 16.5V10.5H1.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

TriggerIcon.displayName = 'BranchIcon';
export default TriggerIcon;
