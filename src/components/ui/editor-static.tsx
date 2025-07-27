import type { VariantProps } from 'class-variance-authority';
import { type PlateStaticProps, PlateStatic } from 'platejs';

import { cn } from '@/lib/utils';
import { editorVariants } from './editor-variants';

export function EditorStatic({
  className,
  variant,
  ...props
}: PlateStaticProps & VariantProps<typeof editorVariants>) {
  return (
    <PlateStatic
      className={cn(editorVariants({ variant }), className)}
      {...props}
    />
  );
}
