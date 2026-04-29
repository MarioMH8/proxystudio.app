import { Command } from 'cmdk';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Empty state shown when no settings match the current search.
 */
function CommandPaletteEmpty(): ReactNode {
	const { t } = useTranslation();

	return (
		<Command.Empty className='py-6 text-center text-sm text-foreground-500'>
			{t('commandPalette.empty')}
		</Command.Empty>
	);
}

CommandPaletteEmpty.displayName = 'CommandPaletteEmpty';

export default CommandPaletteEmpty;
