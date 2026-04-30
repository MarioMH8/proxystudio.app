import Button from '@components/button';
import { CommandPalette, CommandPaletteTrigger } from '@components/command-palette';
import KeyboardShortcut from '@components/keyboard-shortcut';
import { modifierKey } from '@shared/platform';
import { SearchIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';

const key = modifierKey();

function InternalCommandPalette(): ReactNode {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	useHotkeys(
		'meta+k,ctrl+k',
		event => {
			event.preventDefault();
			setOpen(true);
		},
		{
			enableOnFormTags: true,
			preventDefault: true,
		},
		[]
	);

	return (
		<CommandPalette
			onOpenChange={setOpen}
			open={open}>
			<CommandPaletteTrigger asChild>
				<Button
					aria-label={t('commandPalette.dialogTitle')}
					dimension='sm'
					icon={false}
					surface='command'
					transparent>
					<SearchIcon
						aria-hidden='true'
						size={13}
						strokeWidth={3}
					/>
					<KeyboardShortcut
						aria-hidden='true'
						ariaKey='K'
						dimension='sm'
						keyLabel='K'
						modifiers={[key]}
					/>
				</Button>
			</CommandPaletteTrigger>
		</CommandPalette>
	);
}

InternalCommandPalette.displayName = 'CommandPalette';

export default InternalCommandPalette;
