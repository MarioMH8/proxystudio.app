import FlexBox from '@components/flex-box';
import KeyboardShortcut from '@components/keyboard-shortcut';
import Span from '@components/span';
import { cn } from '@shared/cva';
import type { ModifierKey } from '@shared/platform';
import { Command } from 'cmdk';
import type { ReactNode } from 'react';

interface CommandPaletteItemShortcut {
	ariaKey: string;
	keyLabel: string;
	modifiers: ModifierKey[];
}

interface CommandPaletteItemProps {
	/** Whether the item is disabled. */
	disabled?: boolean;
	/** Unique stable key / cmdk value. */
	id: string;
	/** Human-readable action label. */
	label: string;
	/** Called when the item is selected. */
	onSelect: () => void;
	/** Optional keyboard shortcut hint. */
	shortcut?: CommandPaletteItemShortcut | undefined;
}

/**
 * A single selectable action row in the command palette.
 * Uses the shared `<Span>` component for the label text.
 */
function CommandPaletteItem({ disabled = false, id, label, onSelect, shortcut }: CommandPaletteItemProps): ReactNode {
	return (
		<FlexBox
			asChild
			justify='between'>
			<Command.Item
				className={cn(
					'px-3 py-2',
					'cursor-pointer text-sm',
					'aria-selected:bg-foreground-200 dark:aria-selected:bg-foreground-800',
					'aria-disabled:pointer-events-none aria-disabled:opacity-40'
				)}
				disabled={disabled}
				key={id}
				onSelect={onSelect}
				value={label}>
				<Span dimension='sm'>{label}</Span>
				{shortcut !== undefined && (
					<KeyboardShortcut
						aria-hidden='true'
						ariaKey={shortcut.ariaKey}
						className='ml-auto'
						dimension='xs'
						keyLabel={shortcut.keyLabel}
						modifiers={shortcut.modifiers}
						variant='surface'
					/>
				)}
			</Command.Item>
		</FlexBox>
	);
}

CommandPaletteItem.displayName = 'CommandPaletteItem';

export type { CommandPaletteItemProps, CommandPaletteItemShortcut };
export default CommandPaletteItem;
