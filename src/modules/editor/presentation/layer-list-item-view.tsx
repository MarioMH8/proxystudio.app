import background from '@components/background';
import Button from '@components/button';
import EditableSpan from '@components/editable-span';
import FlexBox from '@components/flex-box';
import focus from '@components/focus';
import font from '@components/font';
import hover from '@components/hover';
import Span from '@components/span';
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Layer, LayerMoveTarget } from '@modules/card/domain';
import { cn, cva } from '@shared/cva';
import { ChevronDownIcon, ChevronRightIcon, FolderTreeIcon, GripVerticalIcon, LayersIcon } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import LayerListItemContextMenu from './layer-list-item-context-menu';

const variants = cva({
	base: [
		'relative w-full justify-start gap-2 px-2 py-1.5 transition-colors',
		font({ dimension: 'xs', tracking: 'normal', variant: 'muted', weight: 'normal' }),
		focus({ dimension: 'xs', strength: 'soft', variant: 'default' }),
	],
	compoundVariants: [],
	defaultVariants: {
		dragging: false,
		dropMode: 'none',
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
		selected: {
			false: hover({ strength: 'soft', variant: 'default' }),
			true: [
				background(),
				hover({ strength: 'default', variant: 'default' }),
				focus({ dimension: 'xs', strength: 'default', variant: 'default' }),
			],
		},
	},
});

const metaVariants = cva({
	base: ['truncate uppercase', font({ dimension: 'xs', tracking: 'wider', weight: 'light' })],
	compoundVariants: [],
	defaultVariants: {
		selected: false,
	},
	variants: {},
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

interface LayerListItemPermissions {
	canDeleteSelection: boolean;
	canGroupSelection: boolean;
}

interface LayerListItemState {
	isExpanded?: boolean;
	isSelected: boolean;
}

interface LayerDropState {
	position: LayerMoveTarget['position'];
	targetLayerId: string;
}

interface LayerListItemDndProperties {
	attributes: DraggableAttributes;
	isDragging: boolean;
	listeners: DraggableSyntheticListeners | undefined;
	setBottomDropNodeRef: (node: HTMLElement | null) => void;
	setButtonNodeRef: (node: HTMLButtonElement | null) => void;
	setTopDropNodeRef: (node: HTMLElement | null) => void;
	transform: string | undefined;
}

interface LayerListItemViewProperties {
	activeLayerId: string | undefined;
	depth?: number;
	dnd: LayerListItemDndProperties;
	dropState?: LayerDropState | undefined;
	layer: Layer;
	onClick: MouseEventHandler<HTMLButtonElement>;
	onContextMenuSelection: () => void;
	onDeleteSelection: () => void;
	onGroupSelection: () => void;
	onRename: (name: string) => void;
	onToggleExpanded?: (() => void) | undefined;
	permissions: LayerListItemPermissions;
	state: LayerListItemState;
}

function LayerListItemView({
	activeLayerId,
	depth = 0,
	dnd,
	dropState,
	layer,
	onClick,
	onContextMenuSelection,
	onDeleteSelection,
	onGroupSelection,
	onRename,
	onToggleExpanded,
	permissions,
	state,
}: LayerListItemViewProperties): ReactNode {
	const { isExpanded = false, isSelected } = state;
	const { t } = useTranslation();
	const isGroup = layer.type === 'group';
	const name = layer.name ?? t(`layers.options.${layer.type}`);

	function handleExpandIndicatorClick(event: MouseEvent<HTMLSpanElement>): void {
		event.preventDefault();
		event.stopPropagation();
		onToggleExpanded?.();
	}

	function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
		if (!isGroup || !onToggleExpanded) {
			return;
		}

		if (event.key === 'ArrowRight' && !isExpanded) {
			event.preventDefault();
			onToggleExpanded();
		}

		if (event.key === 'ArrowLeft' && isExpanded) {
			event.preventDefault();
			onToggleExpanded();
		}
	}

	function handleExpandIndicatorKeyDown(event: KeyboardEvent<HTMLSpanElement>): void {
		if (event.key !== 'Enter' && event.key !== ' ') {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		onToggleExpanded?.();
	}

	function getDropMode(): 'group' | 'inside' | 'none' | 'reorder' {
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

	function getDropIndicatorPosition(): 'bottom' | 'hidden' | 'top' {
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

	return (
		<div className='relative'>
			<div
				className='absolute inset-x-2 top-0 h-3'
				ref={dnd.setTopDropNodeRef}
			/>
			<LayerListItemContextMenu
				canDeleteSelection={permissions.canDeleteSelection}
				canGroupSelection={permissions.canGroupSelection}
				onDeleteSelection={onDeleteSelection}
				onGroupSelection={onGroupSelection}>
				<Button
					{...dnd.attributes}
					aria-expanded={isGroup ? isExpanded : undefined}
					aria-pressed={isSelected}
					className={variants({
						dragging: dnd.isDragging,
						dropMode: getDropMode(),
						selected: isSelected,
					})}
					dimension='xs'
					onClick={onClick}
					onContextMenu={onContextMenuSelection}
					onKeyDown={handleButtonKeyDown}
					ref={dnd.setButtonNodeRef}
					style={{
						paddingLeft: depth * 16 + 8,
						transform: dnd.transform,
					}}
					transparent
					type='button'
					variant='default'>
					<span
						className='cursor-grab text-foreground-500 active:cursor-grabbing'
						{...dnd.listeners}>
						<GripVerticalIcon
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					</span>
					{isGroup ? (
						<span
							className='shrink-0 cursor-pointer'
							onClick={handleExpandIndicatorClick}
							onKeyDown={handleExpandIndicatorKeyDown}
							role='button'
							tabIndex={0}
							title={t(isExpanded ? 'layers.collapseGroup' : 'layers.expandGroup', {
								name,
							})}>
							{isExpanded ? (
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
						</span>
					) : (
						<span className='w-3.5 shrink-0' />
					)}
					{isGroup ? (
						<FolderTreeIcon
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					) : (
						<LayersIcon
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					)}
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
							className={metaVariants()}
							weight='light'>
							{`${t(`layers.options.${layer.type}`)} · ${layer.id.slice(0, 8)}`}
							{isGroup ? ` · ${layer.children.length.toFixed(0)}` : ''}
						</Span>
					</FlexBox>
					<span className={dropIndicatorVariants({ position: getDropIndicatorPosition() })} />
					{dropState?.position === 'into-end' ? (
						<span className='pointer-events-none absolute inset-x-3 bottom-1 h-px bg-primary/70' />
					) : undefined}
				</Button>
			</LayerListItemContextMenu>
			<div
				className={cn(
					'absolute inset-x-2 bottom-0 h-3',
					activeLayerId === layer.id ? 'pointer-events-none' : ''
				)}
				ref={dnd.setBottomDropNodeRef}
			/>
		</div>
	);
}

LayerListItemView.displayName = 'LayerListItemView';

export type { LayerListItemPermissions, LayerListItemState, LayerListItemViewProperties };

export default LayerListItemView;
