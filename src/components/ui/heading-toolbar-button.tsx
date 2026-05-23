'use client';

import * as React from 'react';
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { useEditorRef, useSelectionFragmentProp } from 'platejs/react';
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ToolbarButton } from './toolbar';

const headingItems = [
  { icon: Heading1Icon, value: 'h1', label: 'Heading 1' },
  { icon: Heading2Icon, value: 'h2', label: 'Heading 2' },
  { icon: Heading3Icon, value: 'h3', label: 'Heading 3' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  h1: Heading1Icon,
  h2: Heading2Icon,
  h3: Heading3Icon,
};

export function HeadingToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const value =
    useSelectionFragmentProp({
      defaultValue: 'p',
      getProp: (node) => node.type,
    }) ?? 'p';

  const [open, setOpen] = React.useState(false);
  const IconValue = iconMap[value] ?? Heading1Icon;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          pressed={open}
          tooltip="Heading"
          isDropdown
          className="p-2 hover:bg-primary-foreground/10 active:bg-primary-foreground/20 rounded-md transition-colors group"
        >
          <IconValue className="w-4 h-4 text-primary-foreground/70 group-hover:text-primary-foreground" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-36 bg-popover text-popover-foreground rounded-md shadow-lg border border-border"
        align="start"
      >
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(value) => {
            editor.tf.setNodes({ type: value });
            editor.tf.focus();
          }}
        >
          {headingItems.map(({ icon: Icon, value: itemValue, label }) => (
            <DropdownMenuRadioItem
              key={itemValue}
              value={itemValue}
              className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm transition-colors hover:bg-muted data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
