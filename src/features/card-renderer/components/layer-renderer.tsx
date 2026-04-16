import type { Layer } from '@domain';
import { memo } from 'react';

import FrameLayerRenderer from '../frame-layer/frame-layer-renderer';
import type { ImageLoadStatus } from '../frame-layer/use-layer-image';

interface LayerRendererProps {
	/** Card height in pixels (for bounds conversion) */
	cardHeight: number;
	/** Card width in pixels (for bounds conversion) */
	cardWidth: number;
	/** Domain Layer type */
	layer: Layer;
	/** Optional callback when image load status changes (for error indicators in layer panel) */
	onImageStatusChange?: ((layerId: string, status: ImageLoadStatus) => void) | undefined;
}

/**
 * Type-dispatched layer rendering.
 * For 'frame': renders Konva.Image with opacity.
 * For other types: renders placeholder (not creatable in v1).
 */
function LayerRendererInner({ cardHeight, cardWidth, layer, onImageStatusChange }: LayerRendererProps) {
	if (!layer.visible) {
		return;
	}

	switch (layer.type) {
		case 'art':
		case 'bottomInfo':
		case 'setSymbol':
		case 'text':
		case 'watermark': {
			// Other layer types are not creatable in v1
			return;
		}
		case 'frame': {
			return (
				<FrameLayerRenderer
					cardHeight={cardHeight}
					cardWidth={cardWidth}
					layer={layer}
					onImageStatusChange={onImageStatusChange}
				/>
			);
		}
	}
}

const LayerRenderer = memo(LayerRendererInner);
LayerRenderer.displayName = 'LayerRenderer';

export type { LayerRendererProps };
export default LayerRenderer;
