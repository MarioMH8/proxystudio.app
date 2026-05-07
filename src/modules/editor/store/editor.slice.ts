import { Card } from '@modules/card/domain';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { editorApi } from './editor.api';

const EDITOR_STATUS = {
	DRAFT: 'DRAFT',
	SAVED: 'SAVED',
	SAVING: 'SAVING',
} as const;

const CARD_HISTORY_LIMIT = 50;

type EditorStatus = (typeof EDITOR_STATUS)[keyof typeof EDITOR_STATUS];

interface CardHistoryState {
	future: Card[];
	past: Card[];
	present: Card;
}

interface EditorSliceState {
	card: CardHistoryState;
	savedCardId: string | undefined;
}

function createCardHistoryState(card: Card): CardHistoryState {
	return { future: [], past: [], present: card };
}

const initialState: EditorSliceState = {
	card: createCardHistoryState(Card.default()),
	savedCardId: undefined,
};

const editorSlice = createSlice({
	extraReducers: builder => {
		builder
			.addMatcher(editorApi.endpoints.findCard.matchFulfilled, (state, action) => {
				state.card = createCardHistoryState(action.payload);
				state.savedCardId = action.payload.id;
			})
			.addMatcher(editorApi.endpoints.saveCard.matchFulfilled, (state, action) => {
				state.savedCardId = action.meta.arg.originalArgs.id;
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
			state.savedCardId = action.payload;
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
	},
});

export type { CardHistoryState, EditorSliceState, EditorStatus };
export { EDITOR_STATUS, editorSlice };
