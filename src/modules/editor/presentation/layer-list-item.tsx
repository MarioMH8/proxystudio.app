import background from '@components/background';
import Button from '@components/button';
import EditableSpan from '@components/editable-span';
import FlexBox from '@components/flex-box';
import focus from '@components/focus';
import font from '@components/font';
import hover from '@components/hover';
import Span from '@components/span';
import type { Layer } from '@modules/card/domain';
import { cva } from '@shared/cva';
import { ChevronDownIcon, ChevronRightIcon, FolderTreeIcon, LayersIcon } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import LayerListItemContextMenu from './layer-list-item-context-menu';

const variants = cva({
	base: [
		'w-full justify-start gap-2 px-2 py-1.5 transition-colors',
		font({ dimension: 'xs', tracking: 'normal', variant: 'muted', weight: 'normal' }),
		focus({ dimension: 'xs', strength: 'soft', variant: 'default' }),
	],
	compoundVariants: [],
	defaultVariants: {
		selected: false,
	},
	variants: {
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

const ICON_SIZE = 14;

interface LayerListItemPermissions {
	canDeleteSelection: boolean;
	canGroupSelection: boolean;
}

interface LayerListItemState {
	isExpanded?: boolean;
	isSelected: boolean;
}

interface LayerListItemProperties {
	depth?: number;
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

function LayerListItem({
	depth = 0,
	layer,
	onClick,
	onContextMenuSelection,
	onDeleteSelection,
	onGroupSelection,
	onRename,
	onToggleExpanded,
	permissions,
	state,
}: LayerListItemProperties): ReactNode {
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

	return (
		<LayerListItemContextMenu
			canDeleteSelection={permissions.canDeleteSelection}
			canGroupSelection={permissions.canGroupSelection}
			onDeleteSelection={onDeleteSelection}
			onGroupSelection={onGroupSelection}>
			<Button
				aria-expanded={isGroup ? isExpanded : undefined}
				aria-pressed={isSelected}
				className={variants({ selected: isSelected })}
				dimension='xs'
				onClick={onClick}
				onContextMenu={onContextMenuSelection}
				onKeyDown={handleButtonKeyDown}
				style={{ paddingLeft: depth * 16 + 8 }}
				transparent
				type='button'
				variant='default'>
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
			</Button>
		</LayerListItemContextMenu>
	);
}

LayerListItem.displayName = 'LayerListItem';

export type { LayerListItemProperties };

export default LayerListItem;
