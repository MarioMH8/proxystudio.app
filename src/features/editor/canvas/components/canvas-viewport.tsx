import { CARD_HEIGHT, CARD_WIDTH } from '@domain';
import type { CardRendererReference } from '@features/card-renderer';
import { CardRenderer } from '@features/card-renderer';
import type { ReactNode, RefObject } from 'react';
import { useMemo, useRef } from 'react';

import { selectCard, selectPan, selectZoom, useEditorSelector } from '../../store';
import useZoomPan from '../hooks/use-zoom-pan';
import { computeScale, computeTranslate } from '../utilities';

interface CanvasViewportProps {
	/** Viewport height in CSS pixels */
	height: number;
	/** Ref exposed to the parent for PNG export */
	rendererReference: RefObject<CardRendererReference | null>;
	/** Viewport width in CSS pixels */
	width: number;
}

/**
 * Editor-aware canvas viewport.
 * Bridges Redux state (card data, zoom, pan) to the portable CardRenderer.
 * Applies zoom and pan as a CSS transform on the renderer container —
 * keeping CardRenderer itself at its native card resolution (CARD_WIDTH × CARD_HEIGHT).
 * Attaches gesture-based zoom/pan interactions via useZoomPan.
 */
function CanvasViewport({ height, rendererReference, width }: CanvasViewportProps): ReactNode {
	const card = useEditorSelector(selectCard);
	const zoom = useEditorSelector(selectZoom);
	const pan = useEditorSelector(selectPan);
	const containerReference = useRef<HTMLDivElement | null>(null);

	useZoomPan({ containerRef: containerReference });

	const scale = useMemo(() => computeScale(width, height, zoom ?? 100), [width, height, zoom]);

	const translate = useMemo(
		() => computeTranslate(width, height, scale, pan.x, pan.y),
		[width, height, scale, pan.x, pan.y]
	);

	return (
		<div
			className='h-full w-full overflow-hidden'
			ref={containerReference}
			style={{ touchAction: 'none' }}>
			{/*
			 * transform-origin: top left so scale expands downward/rightward.
			 * translate + scale positions and zooms the card within the viewport.
			 * will-change: transform hints the browser to promote to a compositor layer.
			 */}
			<div
				style={{
					height: CARD_HEIGHT,
					left: 0,
					position: 'absolute',
					top: 0,
					transform: `translate(${String(translate.x)}px, ${String(translate.y)}px) scale(${String(scale)})`,
					transformOrigin: 'top left',
					width: CARD_WIDTH,
					willChange: 'transform',
				}}>
				<CardRenderer
					card={card}
					ref={rendererReference}
				/>
			</div>
		</div>
	);
}

CanvasViewport.displayName = 'CanvasViewport';

export type { CanvasViewportProps };
export default CanvasViewport;
