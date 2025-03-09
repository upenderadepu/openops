import { LucideProps } from 'lucide-react';

const RunsIcon = ({
  size = 18,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}: LucideProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.25 13.0002L12.825 11.5752"
        stroke={color}
        strokeWidth={+strokeWidth / 1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 12.25C12.4926 12.25 13.5 11.2426 13.5 10C13.5 8.75736 12.4926 7.75 11.25 7.75C10.0074 7.75 9 8.75736 9 10C9 11.2426 10.0074 12.25 11.25 12.25Z"
        stroke={color}
        strokeWidth={+strokeWidth / 1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 5.5V3.8125C12.75 2.2592 11.4908 1 9.9375 1H4.3125C2.7592 1 1.5 2.2592 1.5 3.8125V9.4375C1.875 13 5.5717 12.25 7.125 12.25"
        stroke={color}
        strokeWidth={+strokeWidth / 1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RunsIcon;
