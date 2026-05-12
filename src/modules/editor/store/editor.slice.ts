import { Card } from '@modules/card/domain';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { editorApi } from './editor.api';

const EDITOR_STATUS = {
	DRAFT: 'DRAFT',
	LOADING: 'LOADING',
	SAVED: 'SAVED',
	SAVING: 'SAVING',
} as const;

const EDITOR_TOOL = {
	PAN: 'pan',
	SELECT: 'select',
} as const;

const CARD_HISTORY_LIMIT = 50;
const VIEWPORT_ZOOM_MAX = 4;
const VIEWPORT_ZOOM_MIN = 0.1;
const VIEWPORT_ZOOM_STEP = 0.01;

type EditorStatus = (typeof EDITOR_STATUS)[keyof typeof EDITOR_STATUS];
type EditorTool = (typeof EDITOR_TOOL)[keyof typeof EDITOR_TOOL];

interface ViewportOffset {
	x: number;
	y: number;
}

interface ViewportState {
	hasInteracted: boolean;
	offset: ViewportOffset;
	tool: EditorTool;
	zoom: number;
}

interface LayerPanelState {
	expandedGroupIds: string[];
	selectedLayerIds: string[];
}

interface CardHistoryState {
	future: Card[];
	past: Card[];
	present: Card;
}

interface EditorSliceState {
	card: CardHistoryState;
	isCardLoading: boolean;
	layerPanel: LayerPanelState;
	savedCardId: string | undefined;
	savedCardUpdatedAt: number | undefined;
	viewport: ViewportState;
}

interface ViewportResetPayload {
	markAsInteracted?: boolean;
	zoom?: number;
}

function createCardHistoryState(card: Card): CardHistoryState {
	return { future: [], past: [], present: card };
}

function clampViewportZoom(zoom: number): number {
	return Math.min(Math.max(zoom, VIEWPORT_ZOOM_MIN), VIEWPORT_ZOOM_MAX);
}

function createViewportState(): ViewportState {
	return {
		hasInteracted: false,
		offset: { x: 0, y: 0 },
		tool: EDITOR_TOOL.SELECT,
		zoom: 1,
	};
}

function createLayerPanelState(): LayerPanelState {
	return {
		expandedGroupIds: [],
		selectedLayerIds: [],
	};
}

function hasGroupWithId(card: Card, groupId: string): boolean {
	return card.layers.some(layer => {
		return layer.type === 'group' && layer.id === groupId;
	});
}

function hasLayerWithId(card: Card, layerId: string): boolean {
	return card.layers.some(layer => {
		if (layer.id === layerId) {
			return true;
		}

		return layer.type === 'group' && layer.children.some(child => child.id === layerId);
	});
}

const initialState: EditorSliceState = {
	card: createCardHistoryState(Card.default()),
	isCardLoading: true,
	layerPanel: createLayerPanelState(),
	savedCardId: undefined,
	savedCardUpdatedAt: undefined,
	viewport: createViewportState(),
};

const editorSlice = createSlice({
	extraReducers: builder => {
		builder
			.addMatcher(editorApi.endpoints.findCard.matchPending, state => {
				state.isCardLoading = true;
			})
			.addMatcher(editorApi.endpoints.findCard.matchFulfilled, (state, action) => {
				state.card = createCardHistoryState(action.payload);
				state.isCardLoading = false;
				state.savedCardId = action.payload.id;
				state.savedCardUpdatedAt = action.payload.metadata.updatedAt;
			})
			.addMatcher(editorApi.endpoints.findCard.matchRejected, state => {
				state.isCardLoading = false;
			})
			.addMatcher(editorApi.endpoints.saveCard.matchFulfilled, (state, action) => {
				state.savedCardId = action.meta.arg.originalArgs.id;
				state.savedCardUpdatedAt = action.meta.arg.originalArgs.metadata.updatedAt;
			});
	},
	initialState,
	name: 'editor',
	reducers: {
		clearLayerSelection: state => {
			state.layerPanel.selectedLayerIds = [];
		},
		createCard: {
			prepare: () => ({ payload: crypto.randomUUID() }),
			reducer: (state, action: PayloadAction<string>) => {
				state.card = createCardHistoryState(Card.default({ id: action.payload }));
				state.isCardLoading = false;
				state.layerPanel = createLayerPanelState();
				state.savedCardId = undefined;
				state.savedCardUpdatedAt = undefined;
				state.viewport = createViewportState();
			},
		},
		panViewportBy: (state, action: PayloadAction<ViewportOffset>) => {
			state.viewport.hasInteracted = true;
			state.viewport.offset.x += action.payload.x;
			state.viewport.offset.y += action.payload.y;
		},
		redoCardChanges: state => {
			const nextCard = state.card.future.shift();

			if (!nextCard) {
				return;
			}

			state.card.past.push(state.card.present);

			if (state.card.past.length > CARD_HISTORY_LIMIT) {
				state.card.past.shift();
			}

			state.card.present = nextCard;
		},
		resetCard: (state, action: PayloadAction<string | undefined>) => {
			state.card = createCardHistoryState(Card.default(action.payload ? { id: action.payload } : undefined));
			state.isCardLoading = true;
			state.layerPanel = createLayerPanelState();
			state.savedCardId = action.payload;
			state.savedCardUpdatedAt = undefined;
			state.viewport = createViewportState();
		},
		resetViewport: (state, action: PayloadAction<undefined | ViewportResetPayload>) => {
			state.viewport.hasInteracted = action.payload?.markAsInteracted ?? false;
			state.viewport.offset = { x: 0, y: 0 };
			state.viewport.zoom = clampViewportZoom(action.payload?.zoom ?? 1);
		},
		setExpandedLayerGroupIds: (state, action: PayloadAction<string[]>) => {
			state.layerPanel.expandedGroupIds = [...action.payload];
		},
		setLayerSelection: (state, action: PayloadAction<string[]>) => {
			state.layerPanel.selectedLayerIds = [...action.payload];
		},
		setViewportPan: (state, action: PayloadAction<ViewportOffset>) => {
			state.viewport.hasInteracted = true;
			state.viewport.offset = action.payload;
		},
		setViewportTool: (state, action: PayloadAction<EditorTool>) => {
			state.viewport.hasInteracted = true;
			state.viewport.tool = action.payload;
		},
		setViewportZoom: (state, action: PayloadAction<number>) => {
			state.viewport.hasInteracted = true;
			state.viewport.zoom = clampViewportZoom(action.payload);
		},
		toggleLayerGroupExpanded: (state, action: PayloadAction<string>) => {
			const expandedGroupIndex = state.layerPanel.expandedGroupIds.indexOf(action.payload);

			if (expandedGroupIndex !== -1) {
				state.layerPanel.expandedGroupIds.splice(expandedGroupIndex, 1);

				return;
			}

			state.layerPanel.expandedGroupIds.push(action.payload);
		},
		toggleLayerSelection: (state, action: PayloadAction<string>) => {
			const selectedLayerIndex = state.layerPanel.selectedLayerIds.indexOf(action.payload);

			if (selectedLayerIndex !== -1) {
				state.layerPanel.selectedLayerIds.splice(selectedLayerIndex, 1);

				return;
			}

			state.layerPanel.selectedLayerIds.push(action.payload);
		},
		undoCardChanges: state => {
			const previousCard = state.card.past.pop();

			if (!previousCard) {
				return;
			}

			state.card.future.unshift(state.card.present);
			state.card.present = previousCard;
		},
		updateCard: (state, action: PayloadAction<Card>) => {
			if (state.card.present === action.payload) {
				return;
			}

			state.card.past.push(state.card.present);

			if (state.card.past.length > CARD_HISTORY_LIMIT) {
				state.card.past.shift();
			}

			state.card.present = action.payload;
			state.card.future = [];
			state.layerPanel.selectedLayerIds = state.layerPanel.selectedLayerIds.filter(layerId => {
				return hasLayerWithId(action.payload, layerId);
			});
			state.layerPanel.expandedGroupIds = state.layerPanel.expandedGroupIds.filter(groupId => {
				return hasGroupWithId(action.payload, groupId);
			});
		},
		zoomInViewport: state => {
			state.viewport.hasInteracted = true;
			state.viewport.zoom = clampViewportZoom(state.viewport.zoom + VIEWPORT_ZOOM_STEP);
		},
		zoomOutViewport: state => {
			state.viewport.hasInteracted = true;
			state.viewport.zoom = clampViewportZoom(state.viewport.zoom - VIEWPORT_ZOOM_STEP);
		},
	},
});

export type {
	CardHistoryState,
	EditorSliceState,
	EditorStatus,
	EditorTool,
	LayerPanelState,
	ViewportOffset,
	ViewportResetPayload,
	ViewportState,
};
export { EDITOR_STATUS, EDITOR_TOOL, editorSlice };
