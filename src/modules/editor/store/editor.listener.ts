import { createListenerMiddleware } from '@reduxjs/toolkit';

import { editorApi } from './editor.api';
import { editorSlice } from './editor.slice';

const SAVE_CARD_CACHE_KEY = 'save-card';

const editorListenerMiddleware = createListenerMiddleware();

editorListenerMiddleware.startListening({
	actionCreator: editorSlice.actions.setCard,
	effect: (action, { dispatch }) => {
		void dispatch(editorApi.endpoints.saveCard.initiate(action.payload, { fixedCacheKey: SAVE_CARD_CACHE_KEY }));
	},
});

export { editorListenerMiddleware };
