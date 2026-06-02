import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@components/context-menu';
import KeyboardShortcut from '@components/keyboard-shortcut';
import { MODIFIER_KIND, modifierKey } from '@shared/platform';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const key = modifierKey();
const shiftKey = { ariaKeyShortcuts: 'Shift', kind: MODIFIER_KIND.TEXT, label: 'Shift' } as const;

interface LayerListItemContextMenuProperties {
	children: ReactNode;
	isSelectionHidden: boolean;
	onDeleteSelection: () => void;
	onGroupSelection: () => void;
	onToggleSelectionHidden: () => void;
	permissions: {
		canDeleteSelection: boolean;
		canGroupSelection: boolean;
		canToggleSelectionHidden: boolean;
	};
}

function LayerListItemContextMenu({
	children,
	isSelectionHidden,
	onDeleteSelection,
	onGroupSelection,
	onToggleSelectionHidden,
	permissions,
}: LayerListItemContextMenuProperties): ReactNode {
	const { t } = useTranslation();

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					disabled={!permissions.canGroupSelection}
					items='center'
					justify='between'
					onSelect={onGroupSelection}>
					<span>{t('layers.group')}</span>
					<KeyboardShortcut
						aria-hidden='true'
						ariaKey='G'
						dimension='xs'
						keyLabel='G'
						modifiers={[key, shiftKey]}
					/>
				</ContextMenuItem>
				<ContextMenuItem
					disabled={!permissions.canToggleSelectionHidden}
					items='center'
					justify='between'
					onSelect={onToggleSelectionHidden}>
					<span>{t(isSelectionHidden ? 'layers.show' : 'layers.hide')}</span>
					<KeyboardShortcut
						aria-hidden='true'
						ariaKey='H'
						dimension='xs'
						keyLabel='H'
						modifiers={[key, shiftKey]}
					/>
				</ContextMenuItem>
				<ContextMenuItem
					disabled={!permissions.canDeleteSelection}
					items='center'
					justify='between'
					onSelect={onDeleteSelection}
					variant='danger'>
					<span>{t('layers.delete')}</span>
					<KeyboardShortcut
						aria-hidden='true'
						ariaKey='Delete'
						dimension='xs'
						keyLabel='Del'
					/>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

LayerListItemContextMenu.displayName = 'LayerListItemContextMenu';

export default LayerListItemContextMenu;
