import Button from '@components/button';
import {
	CommandPalette,
	CommandPaletteDialog,
	CommandPaletteEmpty,
	CommandPaletteInput,
	CommandPaletteItem,
	CommandPaletteList,
	CommandPaletteTrigger,
} from '@components/command-palette';
import KeyboardShortcut from '@components/keyboard-shortcut';
import { modifierKey } from '@shared/platform';
import { SearchIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const key = modifierKey();

function InternalCommandPalette(): ReactNode {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	function goEditor(): void {
		void navigate('/editor');
	}

	function goGallery(): void {
		void navigate('/gallery');
	}

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

	useHotkeys(
		'meta+e,ctrl+e',
		event => {
			event.preventDefault();
			goEditor();
		},
		{
			enableOnFormTags: true,
			preventDefault: true,
		},
		[]
	);

	useHotkeys(
		'meta+g,ctrl+g',
		event => {
			event.preventDefault();
			goGallery();
		},
		{
			enableOnFormTags: true,
			preventDefault: true,
		},
		[]
	);

	function handleSelect(action: () => void): void {
		setOpen(false);
		action();
	}

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
			<CommandPaletteDialog>
				<CommandPaletteInput />
				<CommandPaletteList>
					<CommandPaletteEmpty />
					<CommandPaletteItem
						id='go-editor'
						label={t('commandPalette.actions.goEditor')}
						onSelect={() => {
							handleSelect(() => {
								goEditor();
							});
						}}
						shortcut={{ ariaKey: 'E', keyLabel: 'E', modifiers: [key] }}
					/>
					<CommandPaletteItem
						id='go-gallery'
						label={t('commandPalette.actions.goGallery')}
						onSelect={() => {
							handleSelect(() => {
								goGallery();
							});
						}}
						shortcut={{ ariaKey: 'G', keyLabel: 'G', modifiers: [key] }}
					/>
				</CommandPaletteList>
			</CommandPaletteDialog>
		</CommandPalette>
	);
}

InternalCommandPalette.displayName = 'CommandPalette';

export default InternalCommandPalette;
