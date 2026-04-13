import { Command } from 'cmdk';
import type { ReactNode } from 'react';

import type { Command as CommandDefinition } from '../hooks/use-commands';

interface CommandPaletteProps {
	/** The list of commands to display and filter. */
	commands: CommandDefinition[];
	/** Called when the palette should open or close. */
	onOpenChange: (open: boolean) => void;
	/** Whether the palette is currently open. */
	open: boolean;
}

/**
 * Searchable command palette overlay built with cmdk.
 * Opened via Cmd+K / Ctrl+K or the toolbar button.
 *
 * - Lists all available actions with a live text filter.
 * - Pressing Enter (or clicking) executes the selected action and closes the palette.
 * - Pressing Escape closes the palette.
 */
function CommandPalette({ commands, onOpenChange, open }: CommandPaletteProps): ReactNode {
	function handleSelect(command: CommandDefinition): void {
		if (command.disabled?.()) {
			return;
		}

		command.action();
		onOpenChange(false);
	}

	return (
		<Command.Dialog
			contentClassName='fixed inset-x-4 top-[20%] mx-auto max-w-xl overflow-hidden rounded-xl border border-foreground-200 bg-foreground-50 shadow-2xl dark:border-foreground-700 dark:bg-foreground-900'
			onOpenChange={onOpenChange}
			open={open}
			overlayClassName='fixed inset-0 bg-black/40 backdrop-blur-sm'>
			{/* Search input */}
			<div className='flex items-center border-b border-foreground-200 px-3 dark:border-foreground-700'>
				<Command.Input
					className='flex-1 bg-transparent py-3 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none dark:text-foreground-50 dark:placeholder:text-foreground-500'
					placeholder='Search actions…'
				/>
			</div>

			{/* Results list */}
			<Command.List className='max-h-72 overflow-y-auto py-2'>
				<Command.Empty className='py-6 text-center text-sm text-foreground-500'>
					No actions found.
				</Command.Empty>

				{commands.map(command => {
					const isDisabled = command.disabled?.() ?? false;

					return (
						<Command.Item
							className='flex cursor-pointer items-center justify-between px-3 py-2 text-sm aria-selected:bg-foreground-100 dark:aria-selected:bg-foreground-800 aria-disabled:pointer-events-none aria-disabled:opacity-40'
							disabled={isDisabled}
							key={command.id}
							onSelect={() => {
								handleSelect(command);
							}}
							value={command.label}>
							<span className='font-medium text-foreground-900 dark:text-foreground-50'>
								{command.label}
							</span>
							{command.shortcut !== undefined && (
								<kbd className='ml-auto rounded bg-foreground-200 px-1.5 py-0.5 font-mono text-xs text-foreground-500 dark:bg-foreground-700 dark:text-foreground-400'>
									{command.shortcut}
								</kbd>
							)}
						</Command.Item>
					);
				})}
			</Command.List>
		</Command.Dialog>
	);
}

CommandPalette.displayName = 'CommandPalette';

export type { CommandPaletteProps };
export default CommandPalette;
