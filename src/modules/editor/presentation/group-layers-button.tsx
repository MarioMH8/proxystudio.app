import Button from '@components/button';
import { Card, Layer } from '@modules/card/domain';
import { editorSlice, selectCard, selectExpandedGroupIds, selectSelectedLayerIds } from '@modules/editor/store';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { FolderIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

function GroupLayersButton(): ReactNode {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const card = useAppSelector(selectCard);
	const expandedGroupIds = useAppSelector(selectExpandedGroupIds);
	const selectedLayerIds = useAppSelector(selectSelectedLayerIds);
	const canGroupSelection = Layer.canGroupSelection(card.layers, selectedLayerIds);

	function handleGroupSelection(): void {
		if (!canGroupSelection) {
			return;
		}

		const previousGroupIds = new Set(Layer.findGroups(card.layers).map(layer => layer.id));
		const nextCard = Card.groupLayers(card, selectedLayerIds);
		const nextGroup = Layer.findGroups(nextCard.layers).find(layer => {
			return !previousGroupIds.has(layer.id);
		});

		dispatch(editorSlice.actions.setCard(nextCard));

		if (nextGroup?.type === 'group') {
			dispatch(
				editorSlice.actions.layerPanelExpandedGroupsSet([...new Set([nextGroup.id, ...expandedGroupIds])])
			);
			dispatch(editorSlice.actions.layerPanelSelectionSet([nextGroup.id]));
		}
	}

	return (
		<Button
			aria-label={t('layers.group')}
			dimension='xs'
			disabled={!canGroupSelection}
			icon
			onClick={handleGroupSelection}
			transparent
			type='button'>
			<FolderIcon
				aria-hidden='true'
				size={14}
			/>
		</Button>
	);
}

GroupLayersButton.displayName = 'GroupLayersButton';

export default GroupLayersButton;
