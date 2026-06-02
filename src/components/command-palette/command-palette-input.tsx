import background from '@components/background';
import border from '@components/border';
import FlexBox from '@components/flex-box';
import KeyboardShortcut from '@components/keyboard-shortcut';
import rounded from '@components/rounded';
import { cn } from '@shared/cva';
import { Command } from 'cmdk';
import { SearchIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Styled search input for the command palette.
 */
function CommandPaletteInput(): ReactNode {
	const { t } = useTranslation();

	return (
		<FlexBox
			className={cn(border({ side: 'bottom', strength: 'default', variant: 'default' }), 'px-3 gap-4')}
			items='center'
			justify='between'>
			<SearchIcon size={14} />
			<Command.Input
				aria-label={t('commandPalette.searchAriaLabel')}
				className={cn(
					'flex-1 py-3 text-sm',
					background({ variant: 'transparent' }),
					rounded({ dimension: 'md' }),
					'placeholder:text-foreground-400 dark:placeholder:text-foreground-500',
					'outline-none'
				)}
				placeholder={t('commandPalette.searchPlaceholder')}
			/>
			<KeyboardShortcut
				aria-hidden='true'
				ariaKey='Escape'
				className='ml-auto'
				dimension='xs'
				keyLabel='Esc'
				variant='surface'
			/>
		</FlexBox>
	);
}

CommandPaletteInput.displayName = 'CommandPaletteInput';

export default CommandPaletteInput;
