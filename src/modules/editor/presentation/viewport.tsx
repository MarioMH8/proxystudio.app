import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import { cva } from 'cva';
import type { HTMLAttributes, ReactNode } from 'react';
import { Panel } from 'react-resizable-panels';

import EditorViewportToolbar from './viewport-toolbar';

const variants = cva({
	base: 'relative',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type EditorViewportProperties = Omit<HTMLAttributes<HTMLDivElement>, 'onResize'> & VariantProperties<typeof variants>;

function EditorViewport({ children, className, ...properties }: EditorViewportProperties): ReactNode {
	return (
		<Panel
			className={cn(variants({ className }), className)}
			id='editor-viewport'
			{...properties}>
			{children}
			<EditorViewportToolbar />
		</Panel>
	);
}

EditorViewport.displayName = 'EditorViewport';

export default EditorViewport;
