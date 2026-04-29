import background from '@components/background';
import FlexBox from '@components/flex-box';
import rounded from '@components/rounded';
import Span from '@components/span';
import { cn } from '@shared/cva';
import { Command } from 'cmdk';
import type { ReactNode } from 'react';

interface CommandPaletteItemProps {
	/** Whether the item is disabled. */
	disabled?: boolean;
	/** Unique stable key / cmdk value. */
	id: string;
	/** Human-readable action label. */
	label: string;
	/** Called when the item is selected. */
	onSelect: () => void;
	/** Optional keyboard shortcut hint, e.g. "⌘+Z". */
	shortcut?: string | undefined;
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
				className='cursor-pointer px-3 py-2 text-sm aria-selected:bg-foreground-100 dark:aria-selected:bg-foreground-800 aria-disabled:pointer-events-none aria-disabled:opacity-40'
				disabled={disabled}
				key={id}
				onSelect={onSelect}
				value={label}>
				<Span
					className='font-medium text-foreground-900 dark:text-foreground-50'
					dimension='sm'>
					{label}
				</Span>
				{shortcut !== undefined && (
					<kbd
						className={cn(
							'ml-auto px-1.5 py-0.5 font-mono text-xs text-foreground-500 dark:text-foreground-400',
							background({ variant: 'default' }),
							rounded()
						)}>
						{shortcut}
					</kbd>
				)}
			</Command.Item>
		</FlexBox>
	);
}

CommandPaletteItem.displayName = 'CommandPaletteItem';

export type { CommandPaletteItemProps };
export default CommandPaletteItem;
