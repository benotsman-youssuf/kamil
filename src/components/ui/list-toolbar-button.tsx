'use client';

import { KEYS } from 'platejs';
import {
  useListToolbarButton,
  useListToolbarButtonState,
} from '@platejs/list-classic/react';
import { ListOrderedIcon, ListIcon } from 'lucide-react';

import { ToolbarButton } from './toolbar';
import { cn } from '@/lib/utils';

const nodeTypeMap: Record<string, { icon: React.ReactNode; label: string }> = {
  [KEYS.olClassic]: {
    icon: (
      <ListOrderedIcon className="w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
    ),
    label: 'Numbered List',
  },
  [KEYS.ulClassic]: {
    icon: (
      <ListIcon className="w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
    ),
    label: 'Bulleted List',
  },
};

export function ListToolbarButton({
  className,
  nodeType = KEYS.ulClassic,
  ...props
}: React.ComponentProps<typeof ToolbarButton> & {
  nodeType?: string;
}) {
  const state = useListToolbarButtonState({ nodeType });
  const { props: buttonProps } = useListToolbarButton(state);
  const { icon, label } = nodeTypeMap[nodeType] ?? nodeTypeMap[KEYS.ulClassic];

  return (
    <ToolbarButton
      {...props}
      {...buttonProps}
      tooltip={label}
      className={cn(
        'p-1.5 rounded-lg hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-all duration-150 ease-out group',
        className
      )}
    >
      {icon}
    </ToolbarButton>
  );
}
