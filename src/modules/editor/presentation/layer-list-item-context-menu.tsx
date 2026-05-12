import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@components/context-menu';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LayerListItemContextMenuProperties {
	canDeleteSelection: boolean;
	canGroupSelection: boolean;
	children: ReactNode;
	onDeleteSelection: () => void;
	onGroupSelection: () => void;
}

function LayerListItemContextMenu({
	canDeleteSelection,
	canGroupSelection,
	children,
	onDeleteSelection,
	onGroupSelection,
}: LayerListItemContextMenuProperties): ReactNode {
	const { t } = useTranslation();

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					disabled={!canGroupSelection}
					onSelect={onGroupSelection}>
					{t('layers.group')}
				</ContextMenuItem>
				<ContextMenuItem
					disabled={!canDeleteSelection}
					onSelect={onDeleteSelection}
					variant='danger'>
					{t('layers.delete')}
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

LayerListItemContextMenu.displayName = 'LayerListItemContextMenu';

export default LayerListItemContextMenu;
