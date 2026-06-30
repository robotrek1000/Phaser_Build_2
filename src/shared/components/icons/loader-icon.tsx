import type { FC, SVGProps } from 'react';

export const LoaderIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_6_3138)">
        <g clipPath="url(#clip1_6_3138)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.7059 35.9559C18.485 37.0067 17.4539 37.6792 16.403 37.4579C8.44952 35.7828 2.49615 28.661 2.49291 20.1637C2.48919 10.4345 10.3093 2.49915 19.9864 2.49915C29.6635 2.49915 37.4897 10.4345 37.4934 20.1637C37.4938 21.3451 37.3834 22.4863 37.1607 23.6138C36.9526 24.6673 35.9299 25.3522 34.8763 25.1438C33.8228 24.9353 33.1374 23.9122 33.3455 22.8588C33.518 21.9856 33.6048 21.0974 33.6044 20.1637C33.6015 12.5437 27.4787 6.38809 19.9879 6.38809C12.497 6.38809 6.37894 12.5437 6.38185 20.1637C6.38439 26.8149 11.0421 32.3549 17.203 33.6524C18.254 33.8737 18.9268 34.905 18.7059 35.9559Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_6_3138">
          <rect width="40" height="40" fill="currentColor" />
        </clipPath>
        <clipPath id="clip1_6_3138">
          <rect width="40" height="40" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};
