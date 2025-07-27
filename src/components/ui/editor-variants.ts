import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const editorVariants = cva(
  cn(
    'group/editor',
    'relative w-full cursor-text overflow-x-hidden break-words whitespace-pre-wrap select-text',
    'rounded-md ring-offset-background focus-visible:outline-none',
    'placeholder:text-muted-foreground/80 **:data-slate-placeholder:top-[auto_!important] **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100!',
    '[&_strong]:font-bold'
  ),
  {
    defaultVariants: {
      variant: 'none',
    },
    variants: {
      variant: {
        none: 'min-h-[200px]',
        compact: 'min-h-[100px]',
        full: 'min-h-[500px]',
      },
    },
  }
);
