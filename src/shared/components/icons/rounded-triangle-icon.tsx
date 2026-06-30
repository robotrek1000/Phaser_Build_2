import type { FC, SVGProps } from 'react';

export const RoundedTriangleIcon: FC<SVGProps<SVGSVGElement>> = ({
  stroke = '#102B42',
  ...props
}) => {
  return (
    <svg
      {...props}
      viewBox="0 0 39 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.1191 5.25586C16.3518 0.914649 22.5584 0.914637 24.791 5.25586L36.2354 27.5098C38.2888 31.5026 35.3903 36.2536 30.9004 36.2539H8.00977C3.51988 36.2536 0.62132 31.5027 2.6748 27.5098L14.1191 5.25586Z"
        fill="currentColor"
        stroke={stroke}
        strokeWidth="4"
      />
    </svg>
  );
};
