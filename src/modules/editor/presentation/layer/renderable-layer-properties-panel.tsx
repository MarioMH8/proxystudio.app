import border from '@components/border';
import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import Input from '@components/input';
import Label from '@components/label';
import { Card } from '@modules/card/domain';
import { editorSlice, selectCard, selectSingleSelectedRenderableLayer } from '@modules/editor/store';
import { cn } from '@shared/cva';
import { useAppDispatch, useAppSelector } from '@shared/store';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

function parseNumber(value: string): number | undefined {
	if (value.trim().length === 0) {
		return;
	}

	const parsed = Number(value);

	return Number.isFinite(parsed) ? parsed : undefined;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function RenderableLayerPropertiesPanel(): ReactNode {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const card = useAppSelector(selectCard);
	const selectedLayer = useAppSelector(selectSingleSelectedRenderableLayer);

	if (!selectedLayer) {
		return;
	}

	const layerId = selectedLayer.id;

	function updateCard(nextCard: Card): void {
		dispatch(editorSlice.actions.updateCard(nextCard));
	}

	function handleBoundsChanged(axis: 'height' | 'width' | 'x' | 'y', value: string): void {
		const parsedValue = parseNumber(value);

		if (parsedValue === undefined) {
			return;
		}

		const normalizedValue = axis === 'height' || axis === 'width' ? Math.max(0, parsedValue) : parsedValue;

		updateCard(
			Card.setRenderableLayerProperties(card, layerId, {
				bounds: {
					[axis]: normalizedValue,
				},
			})
		);
	}

	function handleRotationChanged(value: string): void {
		const parsedValue = parseNumber(value);

		if (parsedValue === undefined) {
			return;
		}

		updateCard(
			Card.setRenderableLayerProperties(card, layerId, {
				rotation: parsedValue,
			})
		);
	}

	function handleOpacityChanged(value: string): void {
		const parsedValue = parseNumber(value);

		if (parsedValue === undefined) {
			return;
		}

		updateCard(
			Card.setRenderableLayerProperties(card, layerId, {
				opacity: clamp(parsedValue, 0, 1),
			})
		);
	}

	return (
		<FlexBox
			className={cn(border({ side: 'top' }), 'gap-3 p-3')}
			direction='column'
			items='stretch'>
			<Heading
				dimension='sm'
				heading='h3'
				uppercase
				variant='muted'
				weight='medium'>
				{t('layers.properties.title')}
			</Heading>
			<div className='grid grid-cols-2 gap-2'>
				<Label
					dimension='sm'
					htmlFor='layer-property-x'>
					{t('layers.properties.x')}
					<Input
						dimension='sm'
						id='layer-property-x'
						onChange={event => handleBoundsChanged('x', event.currentTarget.value)}
						type='number'
						value={selectedLayer.bounds.x}
					/>
				</Label>
				<Label
					dimension='sm'
					htmlFor='layer-property-y'>
					{t('layers.properties.y')}
					<Input
						dimension='sm'
						id='layer-property-y'
						onChange={event => handleBoundsChanged('y', event.currentTarget.value)}
						type='number'
						value={selectedLayer.bounds.y}
					/>
				</Label>
				<Label
					dimension='sm'
					htmlFor='layer-property-width'>
					{t('layers.properties.width')}
					<Input
						dimension='sm'
						id='layer-property-width'
						min={0}
						onChange={event => handleBoundsChanged('width', event.currentTarget.value)}
						type='number'
						value={selectedLayer.bounds.width}
					/>
				</Label>
				<Label
					dimension='sm'
					htmlFor='layer-property-height'>
					{t('layers.properties.height')}
					<Input
						dimension='sm'
						id='layer-property-height'
						min={0}
						onChange={event => handleBoundsChanged('height', event.currentTarget.value)}
						type='number'
						value={selectedLayer.bounds.height}
					/>
				</Label>
				<Label
					dimension='sm'
					htmlFor='layer-property-rotation'>
					{t('layers.properties.rotation')}
					<Input
						dimension='sm'
						id='layer-property-rotation'
						onChange={event => handleRotationChanged(event.currentTarget.value)}
						type='number'
						value={selectedLayer.rotation}
					/>
				</Label>
				<Label
					dimension='sm'
					htmlFor='layer-property-opacity'>
					{t('layers.properties.opacity')}
					<Input
						dimension='sm'
						id='layer-property-opacity'
						max={1}
						min={0}
						onChange={event => handleOpacityChanged(event.currentTarget.value)}
						step={0.01}
						type='number'
						value={selectedLayer.opacity}
					/>
				</Label>
			</div>
		</FlexBox>
	);
}

RenderableLayerPropertiesPanel.displayName = 'RenderableLayerPropertiesPanel';

export default RenderableLayerPropertiesPanel;
