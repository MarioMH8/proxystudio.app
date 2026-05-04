import Span from '@components/span';
import {
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	ToolbarSeparator,
	ToolbarToggleGroup,
	ToolbarToggleItem,
} from '@components/toolbar';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import {
	CircleHelpIcon,
	ExpandIcon,
	HandIcon,
	MousePointer2Icon,
	Redo2Icon,
	Undo2Icon,
	ZoomInIcon,
	ZoomOutIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = 14;

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

	return (
		<Toolbar
			aria-label={t('editor.viewportToolbar.ariaLabel')}
			className={cn(variants({ className }), className)}>
			<ToolbarGroup>
				<ToolbarToggleGroup
					aria-label={t('editor.viewportToolbar.tools')}
					defaultValue='select'
					type='single'>
					<ToolbarToggleItem
						aria-label={t('editor.viewportToolbar.selectTool')}
						icon
						value='select'>
						<MousePointer2Icon
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					</ToolbarToggleItem>
					<ToolbarToggleItem
						aria-label={t('editor.viewportToolbar.panTool')}
						icon
						value='pan'>
						<HandIcon
							aria-hidden='true'
							size={ICON_SIZE}
						/>
					</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</ToolbarGroup>
			<ToolbarSeparator />
			<ToolbarGroup>
				<ToolbarButton
					aria-label={t('editor.viewportToolbar.undo')}
					icon>
					<Undo2Icon
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				</ToolbarButton>
				<ToolbarButton
					aria-label={t('editor.viewportToolbar.redo')}
					icon>
					<Redo2Icon
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				</ToolbarButton>
			</ToolbarGroup>
			<ToolbarSeparator />
			<ToolbarGroup>
				<ToolbarButton
					aria-label={t('editor.viewportToolbar.search')}
					icon>
					<ZoomOutIcon
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				</ToolbarButton>
				<Span
					className='min-w-12 text-center'
					dimension='sm'
					tracking='normal'
					variant='default'
					weight='medium'>
					100%
				</Span>
				<ToolbarButton
					aria-label={t('editor.viewportToolbar.zoomIn')}
					icon>
					<ZoomInIcon
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				</ToolbarButton>
				<ToolbarButton
					aria-label={t('editor.viewportToolbar.fullscreen')}
					icon>
					<ExpandIcon
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				</ToolbarButton>
			</ToolbarGroup>
			<ToolbarSeparator />
			<ToolbarGroup>
				<ToolbarButton
					aria-label={t('editor.viewportToolbar.help')}
					icon>
					<CircleHelpIcon
						aria-hidden='true'
						size={ICON_SIZE}
					/>
				</ToolbarButton>
			</ToolbarGroup>
		</Toolbar>
	);
}

EditorViewportToolbar.displayName = 'EditorViewportToolbar';

export default EditorViewportToolbar;
