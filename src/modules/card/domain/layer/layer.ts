import type { DeepPartial } from '@shared/types';

import { LayerArt } from './layer.art';
import { LayerBottomInfo } from './layer.bottom-info';
import { LayerFrame } from './layer.frame';
import { LayerGroup } from './layer.group';
import { LayerSerialNumber } from './layer.serial-number';
import { LayerSymbol } from './layer.symbol';
import { LayerText } from './layer.text';
import { LayerWatermark } from './layer.watermark';

type Layer =
	| LayerArt
	| LayerBottomInfo
	| LayerFrame
	| LayerGroup
	| LayerSerialNumber
	| LayerSymbol
	| LayerText
	| LayerWatermark;

type PartialLayer = DeepPartial<Layer> & { type: Layer['type'] };

type EffectiveLayer = Exclude<Layer, LayerGroup>;

const Layer = {
	default: (layer: PartialLayer): Layer => {
		switch (layer.type) {
			case 'art': {
				return LayerArt.default(layer);
			}
			case 'bottom-info': {
				return LayerBottomInfo.default(layer);
			}
			case 'frame': {
				return LayerFrame.default(layer);
			}
			case 'group': {
				return LayerGroup.default(layer);
			}
			case 'serial-number': {
				return LayerSerialNumber.default(layer);
			}
			case 'symbol': {
				return LayerSymbol.default(layer);
			}
			case 'text': {
				return LayerText.default(layer);
			}
			case 'watermark': {
				return LayerWatermark.default(layer);
			}
		}
	},
	isLayer: (layer: DeepPartial<Layer>): layer is Layer => {
		return layer.type === 'group';
	},
};

export type { EffectiveLayer };

export { Layer };
