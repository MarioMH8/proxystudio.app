import { settingsApi } from '@modules/settings/store';
import { createAppStore } from '@shared/store';
import { useDispatch, useSelector } from 'react-redux';

const store = createAppStore({
	middlewares: [settingsApi.middleware],
	reducers: {
		[settingsApi.reducerPath]: settingsApi.reducer,
	},
});

type AppRootState = ReturnType<typeof store.getState>;
type AppRootDispatch = typeof store.dispatch;

const useAppSelector = useSelector.withTypes<AppRootState>();
const useAppDispatch = useDispatch.withTypes<AppRootDispatch>();

export type { AppRootDispatch, AppRootState };
export { store, useAppDispatch, useAppSelector };
