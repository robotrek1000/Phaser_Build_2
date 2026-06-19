import styles from './loader.module.css';

import type { LoaderSize, LoaderVariant } from './loader.types';

export const LOADER_VARIANTS: Record<LoaderVariant, string> = {
  white: styles.variantWhite,
  translucentBlack: styles.variantTranslucentBlack,
};

export const LOADER_SIZES: Record<LoaderSize, string> = {
  s: styles.sizeS,
  m: styles.sizeM,
};
