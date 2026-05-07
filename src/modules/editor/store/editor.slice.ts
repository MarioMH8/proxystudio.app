import { Card } from '@modules/card/domain';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { editorApi } from './editor.api';

const EDITOR_STATUS = {
	DRAFT: 'DRAFT',
	SAVED: 'SAVED',
	SAVING: 'SAVING',
} as const;

type EditorStatus = (typeof EDITOR_STATUS)[keyof typeof EDITOR_STATUS];

interface EditorSliceState {
	card: Card;
	savedCardId: string | undefined;
}

const initialState: EditorSliceState = {
	card: Card.default(),
	savedCardId: undefined,
};

const editorSlice = createSlice({
	extraReducers: builder => {
		builder
			.addMatcher(editorApi.endpoints.findCard.matchFulfilled, (state, action) => {
				state.card = action.payload;
				state.savedCardId = action.payload.id;
			})
			.addMatcher(editorApi.endpoints.saveCard.matchFulfilled, (state, action) => {
				state.savedCardId = action.meta.arg.originalArgs.id;
			});
	},
	initialState,
	name: 'editor',
	reducers: {
		cardReset: (state, action: PayloadAction<string | undefined>) => {
			state.card = Card.default(action.payload ? { id: action.payload } : undefined);
			state.savedCardId = undefined;
		},
		setCard: (state, action: PayloadAction<Card>) => {
			state.card = action.payload;
		},
	},
});

export type { EditorSliceState, EditorStatus };
export { EDITOR_STATUS, editorSlice };
