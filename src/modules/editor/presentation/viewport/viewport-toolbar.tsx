import KeyboardShortcut from '@components/keyboard-shortcut';
import Span from '@components/span';
import {
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	ToolbarSeparator,
	ToolbarToggleGroup,
	ToolbarToggleItem,
} from '@components/toolbar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/tooltip';
import {
	EDITOR_TOOL,
	selectCanRedo,
	selectCanUndo,
	selectViewportTool,
	selectViewportZoom,
} from '@modules/editor/store';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { MODIFIER_KIND, modifierKey } from '@shared/platform';
import { useAppSelector } from '@shared/store';
import {
	ExpandIcon,
	FullscreenIcon,
	HandIcon,
	MousePointer2Icon,
	Redo2Icon,
	Undo2Icon,
	ZoomInIcon,
	ZoomOutIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import useEditorCommands from '../editor/use-editor-commands';

const ICON_SIZE = 14;
const key = modifierKey();
const shiftKey = { ariaKeyShortcuts: 'Shift', kind: MODIFIER_KIND.TEXT, label: 'Shift' } as const;

const variants = cva({
	base: 'absolute bottom-3 left-1/2 z-10 -translate-x-1/2',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type EditorViewportToolbarProperties = VariantProperties<typeof variants> & {
	className?: string;
};

function EditorViewportToolbar({ className }: EditorViewportToolbarProperties): ReactNode {
	const { t } = useTranslation();
	const { redo, resetViewport, setViewportTool, toggleFullscreen, undo, zoomIn, zoomOut } = useEditorCommands();
	const canUndo = useAppSelector(selectCanUndo);
	const canRedo = useAppSelector(selectCanRedo);
	const tool = useAppSelector(selectViewportTool);
	const zoom = useAppSelector(selectViewportZoom);

	return (
		<Toolbar
			aria-label={t('editor.viewportToolbar.ariaLabel')}
			className={cn(variants({ className }), className)}>
			<ToolbarGroup>
				<ToolbarToggleGroup
					aria-label={t('editor.viewportToolbar.tools')}
					onValueChange={value => {
						if (value) {
							setViewportTool(value as (typeof EDITOR_TOOL)[keyof typeof EDITOR_TOOL]);
						}
					}}
					type='single'
					value={tool}>
					<Tooltip>
						<TooltipTrigger asChild>
							<div>
								<ToolbarToggleItem
									aria-label={t('editor.viewportToolbar.selectTool')}
									icon
									value={EDITOR_TOOL.SELECT}>
									<MousePointer2Icon
										aria-hidden='true'
										size={ICON_SIZE}
									/>
								</ToolbarToggleItem>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							{t('editor.viewportToolbar.selectTool')}{' '}
							<KeyboardShortcut
								ariaKey='S'
								dimension='sm'
								keyLabel='S'
								variant='surface'
							/>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<div>
								<ToolbarToggleItem
									aria-label={t('editor.viewportToolbar.panTool')}
									icon
									value={EDITOR_TOOL.PAN}>
									<HandIcon
										aria-hidden='true'
										size={ICON_SIZE}
									/>
								</ToolbarToggleItem>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							{t('editor.viewportToolbar.panTool')}{' '}
							<KeyboardShortcut
								ariaKey='H'
								dimension='sm'
								keyLabel='H'
								variant='surface'
							/>
						</TooltipContent>
					</Tooltip>
				</ToolbarToggleGroup>
			</ToolbarGroup>
			<ToolbarSeparator />
			<ToolbarGroup>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>
							<ToolbarButton
								aria-label={t('editor.viewportToolbar.undo')}
								disabled={!canUndo}
								icon
								onClick={undo}>
								<Undo2Icon
									aria-hidden='true'
									size={ICON_SIZE}
								/>
							</ToolbarButton>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						{t('editor.viewportToolbar.undo')}{' '}
						<KeyboardShortcut
							ariaKey='z'
							dimension='sm'
							keyLabel='Z'
							modifiers={[key]}
							variant='surface'
						/>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>
							<ToolbarButton
								aria-label={t('editor.viewportToolbar.redo')}
								disabled={!canRedo}
								icon
								onClick={redo}>
								<Redo2Icon
									aria-hidden='true'
									size={ICON_SIZE}
								/>
							</ToolbarButton>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						{t('editor.viewportToolbar.redo')}{' '}
						<KeyboardShortcut
							ariaKey='Z'
							dimension='sm'
							keyLabel='Z'
							modifiers={[key, shiftKey]}
							variant='surface'
						/>
					</TooltipContent>
				</Tooltip>
			</ToolbarGroup>
			<ToolbarSeparator />
			<ToolbarGroup>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>
							<ToolbarButton
								aria-label={t('editor.viewportToolbar.zoomOut')}
								icon
								onClick={zoomOut}>
								<ZoomOutIcon
									aria-hidden='true'
									size={ICON_SIZE}
								/>
							</ToolbarButton>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						{t('editor.viewportToolbar.zoomOut')}{' '}
						<KeyboardShortcut
							ariaKey='-'
							dimension='sm'
							keyLabel='-'
							variant='surface'
						/>
					</TooltipContent>
				</Tooltip>
				<Span
					className='min-w-12 text-center'
					dimension='sm'
					tracking='normal'
					variant='default'
					weight='medium'>
					{`${Math.round(zoom * 100).toFixed(0)}%`}
				</Span>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>
							<ToolbarButton
								aria-label={t('editor.viewportToolbar.zoomIn')}
								icon
								onClick={zoomIn}>
								<ZoomInIcon
									aria-hidden='true'
									size={ICON_SIZE}
								/>
							</ToolbarButton>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						{t('editor.viewportToolbar.zoomIn')}{' '}
						<KeyboardShortcut
							ariaKey='+'
							dimension='sm'
							keyLabel='+'
							variant='surface'
						/>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>
							<ToolbarButton
								aria-label={t('editor.viewportToolbar.zoomReset')}
								icon
								onClick={resetViewport}>
								<FullscreenIcon
									aria-hidden='true'
									size={ICON_SIZE}
								/>
							</ToolbarButton>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						{t('editor.viewportToolbar.zoomReset')}{' '}
						<KeyboardShortcut
							ariaKey='0'
							dimension='sm'
							keyLabel='0'
							variant='surface'
						/>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>
							<ToolbarButton
								aria-label={t('editor.viewportToolbar.fullscreen')}
								icon
								onClick={toggleFullscreen}>
								<ExpandIcon
									aria-hidden='true'
									size={ICON_SIZE}
								/>
							</ToolbarButton>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						{t('editor.viewportToolbar.fullscreen')}{' '}
						<KeyboardShortcut
							ariaKey='F'
							dimension='sm'
							keyLabel='F'
							variant='surface'
						/>
					</TooltipContent>
				</Tooltip>
			</ToolbarGroup>
		</Toolbar>
	);
}

EditorViewportToolbar.displayName = 'EditorViewportToolbar';

export default EditorViewportToolbar;
