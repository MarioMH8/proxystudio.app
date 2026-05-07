import { settingsApi } from '@modules/settings/store';
import type { Middleware, Reducer } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

interface StoreOptions {
	middlewares?: Middleware[];
	reducers?: Record<string, Reducer>;
}

// Return type is intentionally inferred to preserve full dispatch type information
// eslint-disable-next-line typescript/explicit-module-boundary-types
function createAppStore(options: StoreOptions = {}) {
	const { middlewares = [], reducers = {} } = options;

	return configureStore({
		// eslint-disable-next-line unicorn/prefer-spread
		middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
		reducer: reducers,
	});
}

const store = createAppStore({
	middlewares: [settingsApi.middleware],
	reducers: {
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
