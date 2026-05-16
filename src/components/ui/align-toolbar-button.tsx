 'use client';

import * as React from 'react';
import type { Alignment } from '@platejs/basic-styles';
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { TextAlignPlugin } from '@platejs/basic-styles/react';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from 'lucide-react';

import { useEditorPlugin, useSelectionFragmentProp } from 'platejs/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ToolbarButton } from './toolbar';

const items = [
  { icon: AlignLeftIcon, value: 'left' },
  { icon: AlignCenterIcon, value: 'center' },
  { icon: AlignRightIcon, value: 'right' },
  { icon: AlignJustifyIcon, value: 'justify' },
];

export function AlignToolbarButton(props: DropdownMenuProps) {
  const { editor, tf } = useEditorPlugin(TextAlignPlugin);
  const value =
    useSelectionFragmentProp({
      defaultValue: 'right',
      getProp: (node) => node.align,
    }) ?? 'right';

  const [open, setOpen] = React.useState(false);
  const IconValue =
    items.find((item) => item.value === value)?.icon ?? AlignLeftIcon;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          pressed={open}
          tooltip="Align"
          isDropdown
          className="p-2 hover:bg-primary-foreground/10 active:bg-primary-foreground/20 rounded-md transition-colors group"
        >
          <IconValue className="w-4 h-4 text-primary-foreground/70 group-hover:text-primary-foreground" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-8 bg-popover text-popover-foreground rounded-md shadow-lg border border-border"
        align="start"
      >
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(value) => {
            tf.textAlign.setNodes(value as Alignment);
            editor.tf.focus();
          }}
        >
          {items.map(({ icon: Icon, value: itemValue }) => (
            <DropdownMenuRadioItem
              key={itemValue}
              value={itemValue}
              className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm transition-colors hover:bg-muted data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
            >
              <Icon className="w-4 h-4" />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
