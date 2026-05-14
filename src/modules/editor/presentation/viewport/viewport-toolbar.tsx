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
import { cn } from '@shared/cva';
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
const baseClassName = 'absolute bottom-3 left-1/2 z-10 -translate-x-1/2';

interface ToolbarWithTooltipProperties {
	children: ReactNode;
	content: ReactNode;
}

function ToolbarWithTooltip({ children, content }: ToolbarWithTooltipProperties): ReactNode {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div>{children}</div>
			</TooltipTrigger>
			<TooltipContent>{content}</TooltipContent>
		</Tooltip>
	);
}

interface EditorViewportToolbarProperties {
	className?: string;
}

function EditorViewportToolbar({ className }: EditorViewportToolbarProperties): ReactNode {
	const { t } = useTranslation();
	const { redo, resetViewport, setViewportTool, toggleFullscreen, undo, zoomIn, zoomOut } = useEditorCommands();
	const canUndo = useAppSelector(selectCanUndo);
	const canRedo = useAppSelector(selectCanRedo);
	const tool = useAppSelector(selectViewportTool);
	const zoom = useAppSelector(selectViewportZoom);
	const selectToolShortcut = (
		<>
			{t('editor.viewportToolbar.selectTool')}{' '}
			<KeyboardShortcut
				ariaKey='S'
				dimension='sm'
				keyLabel='S'
				variant='surface'
			/>
		</>
	);
	const panToolShortcut = (
		<>
			{t('editor.viewportToolbar.panTool')}{' '}
			<KeyboardShortcut
				ariaKey='H'
				dimension='sm'
				keyLabel='H'
				variant='surface'
			/>
		</>
	);
	const undoShortcut = (
		<>
			{t('editor.viewportToolbar.undo')}{' '}
			<KeyboardShortcut
				ariaKey='z'
				dimension='sm'
				keyLabel='Z'
				modifiers={[key]}
				variant='surface'
			/>
		</>
	);
	const redoShortcut = (
		<>
			{t('editor.viewportToolbar.redo')}{' '}
			<KeyboardShortcut
				ariaKey='Z'
				dimension='sm'
				keyLabel='Z'
				modifiers={[key, shiftKey]}
				variant='surface'
			/>
		</>
	);
	const zoomOutShortcut = (
		<>
			{t('editor.viewportToolbar.zoomOut')}{' '}
			<KeyboardShortcut
				ariaKey='-'
				dimension='sm'
				keyLabel='-'
				variant='surface'
			/>
		</>
	);
	const zoomInShortcut = (
		<>
			{t('editor.viewportToolbar.zoomIn')}{' '}
			<KeyboardShortcut
				ariaKey='+'
				dimension='sm'
				keyLabel='+'
				variant='surface'
			/>
		</>
	);
	const zoomResetShortcut = (
		<>
			{t('editor.viewportToolbar.zoomReset')}{' '}
			<KeyboardShortcut
				ariaKey='0'
				dimension='sm'
				keyLabel='0'
				variant='surface'
			/>
		</>
	);
	const fullscreenShortcut = (
		<>
			{t('editor.viewportToolbar.fullscreen')}{' '}
			<KeyboardShortcut
				ariaKey='F'
				dimension='sm'
				keyLabel='F'
				variant='surface'
			/>
		</>
	);

	return (
		<Toolbar
			aria-label={t('editor.viewportToolbar.ariaLabel')}
			className={cn(baseClassName, className)}>
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
					<ToolbarWithTooltip content={selectToolShortcut}>
						<ToolbarToggleItem
							aria-label={t('editor.viewportToolbar.selectTool')}
							icon
							value={EDITOR_TOOL.SELECT}>
							<MousePointer2Icon
								aria-hidden='true'
								size={ICON_SIZE}
							/>
						</ToolbarToggleItem>
					</ToolbarWithTooltip>
					<ToolbarWithTooltip content={panToolShortcut}>
						<ToolbarToggleItem
							aria-label={t('editor.viewportToolbar.panTool')}
							icon
							value={EDITOR_TOOL.PAN}>
							<HandIcon
								aria-hidden='true'
								size={ICON_SIZE}
							/>
						</ToolbarToggleItem>
					</ToolbarWithTooltip>
				</ToolbarToggleGroup>
			</ToolbarGroup>
			<ToolbarSeparator />
			<ToolbarGroup>
				<ToolbarWithTooltip content={undoShortcut}>
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
				</ToolbarWithTooltip>
				<ToolbarWithTooltip content={redoShortcut}>
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
				</ToolbarWithTooltip>
			</ToolbarGroup>
			<ToolbarSeparator />
			<ToolbarGroup>
				<ToolbarWithTooltip content={zoomOutShortcut}>
					<ToolbarButton
						aria-label={t('editor.viewportToolbar.zoomOut')}
						icon
						onClick={zoomOut}>
						<ZoomOutIcon
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					</ToolbarButton>
				</ToolbarWithTooltip>
				<Span
					className='min-w-12 text-center'
					dimension='sm'
					tracking='normal'
					variant='default'
					weight='medium'>
					{`${Math.round(zoom * 100).toFixed(0)}%`}
				</Span>
				<ToolbarWithTooltip content={zoomInShortcut}>
					<ToolbarButton
						aria-label={t('editor.viewportToolbar.zoomIn')}
						icon
						onClick={zoomIn}>
						<ZoomInIcon
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					</ToolbarButton>
				</ToolbarWithTooltip>
				<ToolbarWithTooltip content={zoomResetShortcut}>
					<ToolbarButton
						aria-label={t('editor.viewportToolbar.zoomReset')}
						icon
						onClick={resetViewport}>
						<FullscreenIcon
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					</ToolbarButton>
				</ToolbarWithTooltip>
				<ToolbarWithTooltip content={fullscreenShortcut}>
					<ToolbarButton
						aria-label={t('editor.viewportToolbar.fullscreen')}
						icon
						onClick={toggleFullscreen}>
						<ExpandIcon
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					</ToolbarButton>
				</ToolbarWithTooltip>
			</ToolbarGroup>
		</Toolbar>
	);
}

EditorViewportToolbar.displayName = 'EditorViewportToolbar';

export default EditorViewportToolbar;
