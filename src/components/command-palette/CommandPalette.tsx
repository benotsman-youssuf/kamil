import { Command } from 'cmdk';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const handleCommandSelect = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  const commands = {
    editor: [
      { label: 'New Document', action: () => console.log('New Document') },
      { label: 'Save Document', action: () => console.log('Save Document') },
    ],
    navigation: [
      { label: 'Go to Dashboard', action: () => console.log('Go to Dashboard') },
      { label: 'Settings', action: () => console.log('Settings') },
    ],
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] max-w-[95vw] rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden"
    >
      <Command.Input
        placeholder="Search or type a command..."
        className="w-full p-4 border-b border-gray-200 outline-none text-lg"
      />
      <Command.List className="max-h-[400px] overflow-y-auto">
        <Command.Empty className="p-4 text-gray-500 text-center">
          No results found.
        </Command.Empty>

        <Command.Group heading="Editor" className="px-2 py-2">
          {commands.editor.map((cmd) => (
            <Command.Item
              key={cmd.label}
              className="px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 aria-selected:bg-blue-50 aria-selected:text-blue-600"
              onSelect={() => handleCommandSelect(cmd.action)}
            >
              {cmd.label}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Separator className="h-px bg-gray-200 my-2" />

        <Command.Group heading="Navigation" className="px-2 py-2">
          {commands.navigation.map((cmd) => (
            <Command.Item
              key={cmd.label}
              className="px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 aria-selected:bg-blue-50 aria-selected:text-blue-600"
              onSelect={() => handleCommandSelect(cmd.action)}
            >
              {cmd.label}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
