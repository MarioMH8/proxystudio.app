import background from '@components/background';
import border from '@components/border';
import FlexBox from '@components/flex-box';
import focus from '@components/focus';
import rounded from '@components/rounded';
import { cn } from '@shared/cva';
import { Command } from 'cmdk';
import type { ReactNode } from 'react';

/**
 * Styled search input for the command palette.
 */
function CommandPaletteInput(): ReactNode {
	return (
		<FlexBox className={cn(border({ side: 'bottom', strength: 'default', variant: 'default' }), 'px-3')}>
			<Command.Input
				aria-label='Search actions'
				className={cn(
					'flex-1 py-3 text-sm text-foreground-900',
					background({ variant: 'transparent' }),
					rounded({ dimension: 'md' }),
					'placeholder:text-foreground-400 dark:text-foreground-50 dark:placeholder:text-foreground-500',
					focus(),
					'focus-visible:ring-offset-foreground-50 dark:focus-visible:ring-offset-foreground-900'
				)}
				placeholder='Search actions…'
			/>
		</FlexBox>
	);
}

CommandPaletteInput.displayName = 'CommandPaletteInput';

export default CommandPaletteInput;
