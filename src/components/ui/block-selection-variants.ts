import { cva } from 'class-variance-authority';

export const blockSelectionVariants = cva(
  'pointer-events-none absolute inset-0 z-1 bg-brand/[.13] transition-opacity',
  {
    defaultVariants: {
      active: true,
    },
    variants: {
      active: {
        false: 'opacity-0',
        true: 'opacity-100',
      },
    },
  }
);
