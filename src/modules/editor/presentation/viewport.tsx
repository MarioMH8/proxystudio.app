import type { VariantProperties } from '@shared/cva';
import { cn } from '@shared/cva';
import { cva } from 'cva';
import type { HTMLAttributes, ReactNode } from 'react';
import { Panel } from 'react-resizable-panels';

const variants = cva({
	base: '',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type EditorViewportProperties = Omit<HTMLAttributes<HTMLDivElement>, 'onResize'> & VariantProperties<typeof variants>;

function EditorViewport({ className, ...properties }: EditorViewportProperties): ReactNode {
	return (
		<Panel
			className={cn(variants({ className }), className)}
			id='editor-viewport'
			{...properties}
		/>
	);
}

EditorViewport.displayName = 'EditorViewport';

export default EditorViewport;
