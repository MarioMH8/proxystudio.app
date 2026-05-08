import { editorApi, editorListenerMiddleware, editorSlice } from '@modules/editor/store';
import { settingsApi } from '@modules/settings/store';
import type { Middleware, Reducer } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

interface StoreOptions {
	middlewares?: Middleware[];
	reducers?: Record<string, Reducer>;
}

function createAppStore(options: StoreOptions = {}) {
	const { middlewares = [], reducers = {} } = options;

	return configureStore({
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware().prepend(editorListenerMiddleware.middleware).concat(middlewares),
		reducer: reducers,
	});
}

const store = createAppStore({
	middlewares: [settingsApi.middleware, editorApi.middleware],
	reducers: {
		[editorApi.reducerPath]: editorApi.reducer,
		[editorSlice.name]: editorSlice.reducer,
		[settingsApi.reducerPath]: settingsApi.reducer,
	},
});

type AppStore = ReturnType<typeof createAppStore>;
type AppRootState = ReturnType<typeof store.getState>;
type AppRootDispatch = typeof store.dispatch;

const useAppSelector = useSelector.withTypes<AppRootState>();
const useAppDispatch = useDispatch.withTypes<AppRootDispatch>();

export type { AppRootDispatch, AppRootState, AppStore };
export { createAppStore, store, useAppDispatch, useAppSelector };
