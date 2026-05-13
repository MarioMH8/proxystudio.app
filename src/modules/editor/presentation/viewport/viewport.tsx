import { EDITOR_TOOL } from '@modules/editor/store';
import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import { cva } from 'cva';
import type { HTMLAttributes, ReactNode } from 'react';
import { Panel } from 'react-resizable-panels';

import useViewportCamera from './hooks/use-viewport-camera';
import EditorViewportToolbar from './viewport-toolbar';

const variants = cva({
	base: 'relative overflow-hidden',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type EditorViewportProperties = Omit<HTMLAttributes<HTMLDivElement>, 'onResize'> & VariantProperties<typeof variants>;

function EditorViewport({ children, className, ...properties }: EditorViewportProperties): ReactNode {
	const {
		containerRef,
		handlePointerDown,
		handlePointerEnd,
		handlePointerLeave,
		handlePointerMove,
		handleWheel,
		isDragging,
		offsetX,
		offsetY,
		tool,
		zoom,
	} = useViewportCamera();

	return (
		<Panel
			className={cn(variants({ className }), className)}
			id='editor-viewport'
			{...properties}>
			<div
				className={cn(
					'absolute inset-0 touch-none',
					tool === EDITOR_TOOL.PAN ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : undefined
				)}
				onPointerCancel={handlePointerEnd}
				onPointerDown={handlePointerDown}
				onPointerLeave={handlePointerLeave}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerEnd}
				onWheel={handleWheel}
				ref={containerRef}>
				<div className='absolute inset-0 overflow-hidden'>
					<div
						className='absolute left-1/2 top-1/2'
						style={{
							transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
							transformOrigin: 'center center',
						}}>
						{children}
					</div>
				</div>
			</div>
			<EditorViewportToolbar />
		</Panel>
	);
}

EditorViewport.displayName = 'EditorViewport';

export default EditorViewport;
