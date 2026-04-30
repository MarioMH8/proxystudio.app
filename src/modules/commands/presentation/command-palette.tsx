import Button from '@components/button';
import { CommandPalette, CommandPaletteTrigger } from '@components/command-palette';
import KeyboardShortcut from '@components/keyboard-shortcut';
import { modifierKey } from '@shared/platform';
import { SearchIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const key = modifierKey();

function InternalCommandPalette(): ReactNode {
	return (
		<CommandPalette>
			<CommandPaletteTrigger asChild>
				<Button
					dimension='sm'
					icon={false}
					surface='command'
					transparent>
					<SearchIcon
						size={13}
						strokeWidth={3}
					/>
					<KeyboardShortcut
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
