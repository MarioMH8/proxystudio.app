import type { Layer } from '@domain';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { Image as KonvaImage } from 'react-konva';

import type { ImageLoadStatus } from './use-layer-image';
import useLayerImage from './use-layer-image';

interface FrameLayerRendererProps {
	cardHeight: number;
	cardWidth: number;
	layer: Extract<Layer, { type: 'frame' }>;
	onImageStatusChange?: ((layerId: string, status: ImageLoadStatus) => void) | undefined;
}

function FrameLayerRenderer({
	cardHeight,
	cardWidth,
	layer,
	onImageStatusChange,
}: FrameLayerRendererProps): ReactElement | undefined {
	const { image, status } = useLayerImage(layer.src);

	useEffect(() => {
		onImageStatusChange?.(layer.id, status);
	}, [layer.id, status, onImageStatusChange]);

	if (!image) {
		return;
	}

	const x = layer.bounds ? layer.bounds.x * cardWidth : 0;
	const y = layer.bounds ? layer.bounds.y * cardHeight : 0;
	const width = layer.bounds ? layer.bounds.width * cardWidth : cardWidth;
	const height = layer.bounds ? layer.bounds.height * cardHeight : cardHeight;

	return (
		<KonvaImage
			height={height}
			image={image}
			opacity={layer.opacity / 100}
			width={width}
			x={x}
			y={y}
		/>
	);
}

export type { FrameLayerRendererProps };
export default FrameLayerRenderer;
