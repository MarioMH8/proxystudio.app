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

interface CardHistoryState {
	future: Card[];
	past: Card[];
	present: Card;
}

interface EditorSliceState {
	card: CardHistoryState;
	isCardLoading: boolean;
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

const initialState: EditorSliceState = {
	card: createCardHistoryState(Card.default()),
	isCardLoading: true,
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
		cardRedo: state => {
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
		cardReset: (state, action: PayloadAction<string | undefined>) => {
			state.card = createCardHistoryState(Card.default(action.payload ? { id: action.payload } : undefined));
			state.isCardLoading = true;
			state.savedCardId = action.payload;
			state.savedCardUpdatedAt = undefined;
			state.viewport = createViewportState();
		},
		cardUndo: state => {
			const previousCard = state.card.past.pop();

			if (!previousCard) {
				return;
			}

			state.card.future.unshift(state.card.present);
			state.card.present = previousCard;
		},
		setCard: (state, action: PayloadAction<Card>) => {
			if (state.card.present === action.payload) {
				return;
			}

			state.card.past.push(state.card.present);

			if (state.card.past.length > CARD_HISTORY_LIMIT) {
				state.card.past.shift();
			}

			state.card.present = action.payload;
			state.card.future = [];
		},
		viewportPanBy: (state, action: PayloadAction<ViewportOffset>) => {
			state.viewport.hasInteracted = true;
			state.viewport.offset.x += action.payload.x;
			state.viewport.offset.y += action.payload.y;
		},
		viewportPanSet: (state, action: PayloadAction<ViewportOffset>) => {
			state.viewport.hasInteracted = true;
			state.viewport.offset = action.payload;
		},
		viewportReset: (state, action: PayloadAction<undefined | ViewportResetPayload>) => {
			state.viewport.hasInteracted = action.payload?.markAsInteracted ?? false;
			state.viewport.offset = { x: 0, y: 0 };
			state.viewport.zoom = clampViewportZoom(action.payload?.zoom ?? 1);
		},
		viewportToolSet: (state, action: PayloadAction<EditorTool>) => {
			state.viewport.hasInteracted = true;
			state.viewport.tool = action.payload;
		},
		viewportZoomIn: state => {
			state.viewport.hasInteracted = true;
			state.viewport.zoom = clampViewportZoom(state.viewport.zoom + VIEWPORT_ZOOM_STEP);
		},
		viewportZoomOut: state => {
			state.viewport.hasInteracted = true;
			state.viewport.zoom = clampViewportZoom(state.viewport.zoom - VIEWPORT_ZOOM_STEP);
		},
		viewportZoomSet: (state, action: PayloadAction<number>) => {
			state.viewport.hasInteracted = true;
			state.viewport.zoom = clampViewportZoom(action.payload);
		},
	},
});

export type {
	CardHistoryState,
	EditorSliceState,
	EditorStatus,
	EditorTool,
	ViewportOffset,
	ViewportResetPayload,
	ViewportState,
};
export { EDITOR_STATUS, EDITOR_TOOL, editorSlice };
