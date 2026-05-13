import Button from '@components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/dropdown-menu';
import { Card } from '@modules/card/domain';
import { editorSlice, selectCard } from '@modules/editor/store';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { PlusIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type AddableLayerType = Parameters<typeof Card.addLayer>[1];

const ADDABLE_LAYER_TYPES = [
	'art',
	'bottom-info',
	'frame',
	'serial-number',
	'symbol',
	'text',
	'watermark',
] as const satisfies AddableLayerType[];

function AddLayerDropdown(): ReactNode {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const card = useAppSelector(selectCard);

	function handleLayerAdd(layerType: AddableLayerType): void {
		dispatch(editorSlice.actions.updateCard(Card.addLayer(card, layerType)));
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					dimension='xs'
					variant='primary'>
					<PlusIcon
						aria-hidden='true'
						size={14}
					/>
					{t('layers.add')}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{ADDABLE_LAYER_TYPES.map(type => (
					<DropdownMenuItem
						key={type}
						onSelect={() => {
							handleLayerAdd(type);
						}}>
						{t(`layers.options.${type}`)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

AddLayerDropdown.displayName = 'AddLayerDropdown';

export default AddLayerDropdown;
