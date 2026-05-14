import { Card, Layer } from '@modules/card/domain';
import { editorSlice, selectCard, selectExpandedGroupIds, selectSelectedLayerIds } from '@modules/editor/store';
import { useAppDispatch, useAppSelector } from '@shared/store';

interface LayerSelectionActionsResult {
	canDeleteSelection: boolean;
	canGroupSelection: boolean;
	canToggleSelectionHidden: boolean;
	deleteSelection: () => void;
	groupSelection: () => void;
	isSelectionHidden: boolean;
	selectedLayerIds: string[];
	toggleSelectionHidden: () => void;
}

function useLayerSelectionActions(): LayerSelectionActionsResult {
	const dispatch = useAppDispatch();
	const card = useAppSelector(selectCard);
	const expandedGroupIds = useAppSelector(selectExpandedGroupIds);
	const selectedLayerIds = useAppSelector(selectSelectedLayerIds);
	const canDeleteSelection = selectedLayerIds.length > 0;
	const canGroupSelection = Layer.canGroupSelection(card.layers, selectedLayerIds);
	const selectedLayers = selectedLayerIds.flatMap(layerId => {
		const layerResult = Layer.findLayerById(card.layers, layerId);

		return layerResult ? [layerResult.layer] : [];
	});
	const canToggleSelectionHidden = selectedLayers.length > 0;
	const isSelectionHidden = canToggleSelectionHidden && selectedLayers.every(layer => layer.hidden);

	function deleteSelection(): void {
		if (!canDeleteSelection) {
			return;
		}

		dispatch(editorSlice.actions.updateCard(Card.deleteLayers(card, selectedLayerIds)));
		dispatch(editorSlice.actions.clearLayerSelection());
	}

	function groupSelection(): void {
		if (!canGroupSelection) {
			return;
		}

		const previousGroupIds = new Set(Layer.findGroups(card.layers).map(layer => layer.id));
		const nextCard = Card.groupLayers(card, selectedLayerIds);
		const nextGroup = Layer.findGroups(nextCard.layers).find(layer => {
			return !previousGroupIds.has(layer.id);
		});

		dispatch(editorSlice.actions.updateCard(nextCard));

		if (nextGroup?.type === 'group') {
			dispatch(editorSlice.actions.setExpandedLayerGroupIds([...new Set([nextGroup.id, ...expandedGroupIds])]));
			dispatch(editorSlice.actions.setLayerSelection([nextGroup.id]));
		}
	}

	function toggleSelectionHidden(): void {
		if (!canToggleSelectionHidden) {
			return;
		}

		dispatch(editorSlice.actions.updateCard(Card.setLayersHidden(card, selectedLayerIds, !isSelectionHidden)));
	}

	return {
		canDeleteSelection,
		canGroupSelection,
		canToggleSelectionHidden,
		deleteSelection,
		groupSelection,
		isSelectionHidden,
		selectedLayerIds,
		toggleSelectionHidden,
	};
}

export default useLayerSelectionActions;
