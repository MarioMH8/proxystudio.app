import Button from '@components/button';
import { Card } from '@modules/card/domain';
import { editorSlice, selectCard, selectSelectedLayerIds } from '@modules/editor/store';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { Trash2Icon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

function DeleteLayersButton(): ReactNode {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const card = useAppSelector(selectCard);
	const selectedLayerIds = useAppSelector(selectSelectedLayerIds);
	const canDeleteSelection = selectedLayerIds.length > 0;

	function handleDeleteSelection(): void {
		if (!canDeleteSelection) {
			return;
		}

		dispatch(editorSlice.actions.setCard(Card.deleteLayers(card, selectedLayerIds)));
		dispatch(editorSlice.actions.layerPanelSelectionClear());
	}

	return (
		<Button
			aria-label={t('layers.delete')}
			dimension='xs'
			disabled={!canDeleteSelection}
			icon
			onClick={handleDeleteSelection}
			transparent
			type='button'
			variant='danger'>
			<Trash2Icon
				aria-hidden='true'
				size={14}
			/>
		</Button>
	);
}

DeleteLayersButton.displayName = 'DeleteLayersButton';

export default DeleteLayersButton;
