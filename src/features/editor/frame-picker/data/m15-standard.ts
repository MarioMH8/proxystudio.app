import type { Bounds, FrameGroup, FramePack, FrameTile } from '@domain';

/**
 * M15 Standard frame pack data.
 * 9 frames: White, Blue, Black, Red, Green, Artifact, Multicolored, Colorless, Vehicle.
 * Assets live in /public/frames/m15/regular/.
 */

const BASE_PATH = '/frames/m15/regular';

/** All M15 Standard frame tiles */
const M15_TILES: FrameTile[] = [
	{
		bounds: undefined,
		id: 'white',
		mask: undefined,
		name: 'White',
		src: `${BASE_PATH}/white.png`,
		thumbnailSrc: `${BASE_PATH}/white.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'blue',
		mask: undefined,
		name: 'Blue',
		src: `${BASE_PATH}/blue.png`,
		thumbnailSrc: `${BASE_PATH}/blue.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'black',
		mask: undefined,
		name: 'Black',
		src: `${BASE_PATH}/black.png`,
		thumbnailSrc: `${BASE_PATH}/black.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'red',
		mask: undefined,
		name: 'Red',
		src: `${BASE_PATH}/red.png`,
		thumbnailSrc: `${BASE_PATH}/red.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'green',
		mask: undefined,
		name: 'Green',
		src: `${BASE_PATH}/green.png`,
		thumbnailSrc: `${BASE_PATH}/green.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'artifact',
		mask: undefined,
		name: 'Artifact',
		src: `${BASE_PATH}/artifact.png`,
		thumbnailSrc: `${BASE_PATH}/artifact.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'multicolored',
		mask: undefined,
		name: 'Multicolored',
		src: `${BASE_PATH}/multicolored.png`,
		thumbnailSrc: `${BASE_PATH}/multicolored.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'colorless',
		mask: undefined,
		name: 'Colorless',
		src: `${BASE_PATH}/colorless.png`,
		thumbnailSrc: `${BASE_PATH}/colorless.thumb.png`,
	},
	{
		bounds: undefined,
		id: 'vehicle',
		mask: undefined,
		name: 'Vehicle',
		src: `${BASE_PATH}/vehicle.png`,
		thumbnailSrc: `${BASE_PATH}/vehicle.thumb.png`,
	},
];

const M15_STANDARD_PACK: FramePack = {
	groupId: 'standard',
	id: 'm15-standard',
	layoutPreset: undefined,
	name: 'M15 Standard',
	tiles: M15_TILES,
};

const M15_STANDARD_GROUP: FrameGroup = {
	id: 'standard',
	name: 'Standard',
	packs: [M15_STANDARD_PACK],
};

/**
 * Build an addFrameLayer payload from a FrameTile.
 * Used by tests and FramePickerDialog to dispatch layer creation.
 */
function buildAddFrameLayerPayload(tile: FrameTile): {
	bounds: Bounds | undefined;
	defaultName: string;
	name: string;
	src: string;
	tileId: string;
} {
	return {
		bounds: tile.bounds,
		defaultName: tile.name,
		name: tile.name,
		src: tile.src,
		tileId: tile.id,
	};
}

export { buildAddFrameLayerPayload, M15_STANDARD_GROUP, M15_STANDARD_PACK, M15_TILES };
