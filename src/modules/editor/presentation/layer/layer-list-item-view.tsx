import background from '@components/background';
import Button from '@components/button';
import EditableSpan from '@components/editable-span';
import FlexBox from '@components/flex-box';
import focus from '@components/focus';
import font from '@components/font';
import hover from '@components/hover';
import rounded from '@components/rounded';
import Span from '@components/span';
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Layer } from '@modules/card/domain';
import { cn, cva } from '@shared/cva';
import {
	ChevronDownIcon,
	ChevronRightIcon,
	EyeIcon,
	EyeOffIcon,
	FolderTreeIcon,
	GripVerticalIcon,
	LayersIcon,
} from 'lucide-react';
import type { KeyboardEvent, MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { LayerDropState } from './layer-list.dnd';
import { getLayerTreeIndent } from './layer-list.dnd';

const variants = cva({
	base: [
		'relative w-full justify-start gap-2 px-2 py-1.5 transition-colors',
		rounded({ dimension: 'sm' }),
		font({ dimension: 'xs', tracking: 'normal', variant: 'muted', weight: 'normal' }),
		focus({ dimension: 'xs', strength: 'soft', variant: 'default' }),
	],
	compoundVariants: [],
	defaultVariants: {
		dragging: false,
		dropMode: 'none',
		hidden: false,
		selected: false,
	},
	variants: {
		dragging: {
			false: '',
			true: 'opacity-50',
		},
		dropMode: {
			group: 'bg-primary/10 ring-1 ring-primary/40',
			inside: 'bg-primary/10 ring-1 ring-primary/25',
			none: '',
			reorder: '',
		},
		hidden: {
			false: '',
			true: 'opacity-60',
		},
		selected: {
			false: 'hover:bg-transparent',
			true: [background(), focus({ dimension: 'xs', strength: 'default', variant: 'default' })],
		},
	},
});

const dropIndicatorVariants = cva({
	base: 'pointer-events-none absolute left-2 right-2 h-px bg-primary transition-opacity',
	compoundVariants: [],
	defaultVariants: {
		position: 'hidden',
	},
	variants: {
		position: {
			bottom: 'bottom-0 opacity-100',
			hidden: 'opacity-0',
			top: 'top-0 opacity-100',
		},
	},
});

const ICON_SIZE = 14;
const META_CLASS_NAME = cn('truncate uppercase', font({ dimension: 'xs', tracking: 'wider', weight: 'light' }));

interface ExpandIndicatorProperties {
	expanded: boolean;
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	title: string;
	visible: boolean;
}

interface DragHandleProperties {
	listeners: DraggableSyntheticListeners | undefined;
}

function DragHandle({ listeners }: DragHandleProperties): ReactNode {
	return (
		<span
			className='cursor-grab text-foreground-500 active:cursor-grabbing'
			{...listeners}>
			<GripVerticalIcon
				aria-hidden='true'
				size={ICON_SIZE}
			/>
		</span>
	);
}

function ExpandIndicator({ expanded, onClick, title, visible }: ExpandIndicatorProperties): ReactNode {
	if (!visible) {
		return <span className='w-3.5 shrink-0' />;
	}

	return (
		<Button
			aria-label={title}
			className='size-5 shrink-0 p-0'
			dimension='xs'
			icon
			onClick={onClick}
			title={title}
			transparent
			type='button'
			variant='default'>
			{expanded ? (
				<ChevronDownIcon
					aria-hidden='true'
					size={ICON_SIZE}
				/>
			) : (
				<ChevronRightIcon
					aria-hidden='true'
					size={ICON_SIZE}
				/>
			)}
		</Button>
	);
}

interface LayerTypeIndicatorProperties {
	group: boolean;
}

function LayerTypeIndicator({ group }: LayerTypeIndicatorProperties): ReactNode {
	if (group) {
		return (
			<FolderTreeIcon
				aria-hidden='true'
				size={ICON_SIZE}
			/>
		);
	}

	return (
		<LayersIcon
			aria-hidden='true'
			size={ICON_SIZE}
		/>
	);
}

interface VisibilityIndicatorProperties {
	hidden: boolean;
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	title: string;
}

function VisibilityIndicator({ hidden, onClick, title }: VisibilityIndicatorProperties): ReactNode {
	return (
		<Button
			aria-label={title}
			className={cn(
				'ml-auto size-5 shrink-0 p-0 text-foreground-500',
				hover({
					strength: 'soft',
					variant: 'default',
				})
			)}
			dimension='xs'
			icon
			onClick={onClick}
			title={title}
			transparent
			type='button'
			variant='default'>
			{hidden ? (
				<EyeOffIcon
					aria-hidden='true'
					size={ICON_SIZE}
				/>
			) : (
				<EyeIcon
					aria-hidden='true'
					size={ICON_SIZE}
				/>
			)}
		</Button>
	);
}

interface DropIntoEndIndicatorProperties {
	dropState: LayerDropState | undefined;
}

function DropIntoEndIndicator({ dropState }: DropIntoEndIndicatorProperties): ReactNode {
	if (dropState?.position !== 'into-end') {
		return undefined;
	}

	return <span className='pointer-events-none absolute inset-x-3 bottom-1 h-px bg-primary/70' />;
}

function getDropMode(dropState: LayerDropState | undefined): 'group' | 'inside' | 'none' | 'reorder' {
	if (!dropState) {
		return 'none';
	}

	if (dropState.position === 'group-with') {
		return 'group';
	}

	if (dropState.position === 'into-end' || dropState.position === 'into-start') {
		return 'inside';
	}

	return 'reorder';
}

function getDropIndicatorPosition(dropState: LayerDropState | undefined): 'bottom' | 'hidden' | 'top' {
	if (!dropState) {
		return 'hidden';
	}

	if (dropState.position === 'after') {
		return 'top';
	}

	if (dropState.position === 'before') {
		return 'bottom';
	}

	return 'hidden';
}

interface LayerListItemState {
	isExpanded?: boolean;
	isSelected: boolean;
}

interface LayerListItemDndProperties {
	attributes: DraggableAttributes;
	isDragging: boolean;
	listeners: DraggableSyntheticListeners | undefined;
	setBottomDropNodeRef: (node: HTMLElement | null) => void;
	setItemNodeRef: (node: HTMLElement | null) => void;
	setTopDropNodeRef: (node: HTMLElement | null) => void;
	transform: string | undefined;
}

interface LayerListItemViewProperties {
	depth?: number;
	dnd: LayerListItemDndProperties;
	dropState?: LayerDropState | undefined;
	layer: Layer;
	onClick: MouseEventHandler<HTMLDivElement>;
	onContextMenuSelection: () => void;
	onRename: (name: string) => void;
	onToggleExpanded?: (() => void) | undefined;
	onToggleHidden: () => void;
	state: LayerListItemState;
}

function LayerListItemView({
	depth = 0,
	dnd,
	dropState,
	layer,
	onClick,
	onContextMenuSelection,
	onRename,
	onToggleExpanded,
	onToggleHidden,
	state,
}: LayerListItemViewProperties): ReactNode {
	const { isExpanded = false, isSelected } = state;
	const { t } = useTranslation();
	const isGroup = layer.type === 'group';
	const name = layer.name ?? t(`layers.options.${layer.type}`);
	const expandIndicatorTitle = t(isExpanded ? 'layers.collapseGroup' : 'layers.expandGroup', { name });
	const visibilityIndicatorTitle = t(layer.hidden ? 'layers.showLayer' : 'layers.hideLayer', {
		name,
	});

	function handleExpandIndicatorClick(event: MouseEvent<HTMLButtonElement>): void {
		event.preventDefault();
		event.stopPropagation();
		onToggleExpanded?.();
	}

	function handleItemKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
		if (isGroup && onToggleExpanded) {
			if (event.key === 'ArrowRight' && !isExpanded) {
				event.preventDefault();
				onToggleExpanded();

				return;
			}

			if (event.key === 'ArrowLeft' && isExpanded) {
				event.preventDefault();
				onToggleExpanded();

				return;
			}
		}

		if (event.key === 'h' || event.key === 'H') {
			event.preventDefault();
			onToggleHidden();

			return;
		}

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.currentTarget.click();
		}
	}

	function handleVisibilityIndicatorClick(event: MouseEvent<HTMLButtonElement>): void {
		event.preventDefault();
		event.stopPropagation();
		onToggleHidden();
	}

	return (
		<li className='relative'>
			<div
				className='absolute inset-x-2 top-0 h-3'
				ref={dnd.setTopDropNodeRef}
			/>
			<div
				className='absolute inset-x-2 bottom-0 h-3'
				ref={dnd.setBottomDropNodeRef}
			/>
			<FlexBox
				items='center'
				justify='center'
				{...dnd.attributes}
				aria-expanded={isGroup ? isExpanded : undefined}
				aria-pressed={isSelected}
				className={variants({
					dragging: dnd.isDragging,
					dropMode: getDropMode(dropState),
					hidden: layer.hidden,
					selected: isSelected,
				})}
				onClick={onClick}
				onContextMenu={onContextMenuSelection}
				onKeyDown={handleItemKeyDown}
				ref={dnd.setItemNodeRef}
				role='button'
				style={{
					paddingLeft: getLayerTreeIndent(depth),
					transform: dnd.transform,
				}}
				tabIndex={0}>
				<DragHandle listeners={dnd.listeners} />
				<ExpandIndicator
					expanded={isExpanded}
					onClick={handleExpandIndicatorClick}
					title={expandIndicatorTitle}
					visible={isGroup}
				/>
				<LayerTypeIndicator group={isGroup} />
				<FlexBox
					className='min-w-0'
					direction='column'
					items='start'>
					<EditableSpan
						ariaLabel={t('layers.rename')}
						className='truncate'
						inputClassName='truncate'
						onChange={onRename}
						placeholder={name}
						value={name}
					/>
					<Span
						className={META_CLASS_NAME}
						weight='light'>
						{`${t(`layers.options.${layer.type}`)} · ${layer.id.slice(0, 8)}`}
						{isGroup ? ` · ${layer.children.length.toFixed(0)}` : ''}
					</Span>
				</FlexBox>
				<VisibilityIndicator
					hidden={layer.hidden}
					onClick={handleVisibilityIndicatorClick}
					title={visibilityIndicatorTitle}
				/>
				<span className={dropIndicatorVariants({ position: getDropIndicatorPosition(dropState) })} />
				<DropIntoEndIndicator dropState={dropState} />
			</FlexBox>
		</li>
	);
}

LayerListItemView.displayName = 'LayerListItemView';

export type { LayerListItemState, LayerListItemViewProperties };

export default LayerListItemView;
