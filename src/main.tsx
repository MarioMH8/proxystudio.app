import './index.css';
import 'reflect-metadata';
import '@shared/i18n';

import { TooltipProvider } from '@components/tooltip';
import { SettingsSync } from '@modules/settings/presentation';
import { settingsApi } from '@modules/settings/store';
import Router from '@router';
import { store } from '@shared/store';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

await store.dispatch(settingsApi.endpoints.findSettings.initiate());

const root = document.querySelector('#root');

if (!root) {
	throw new Error('#root not found');
}

createRoot(root).render(
	<StrictMode>
		<ReduxProvider store={store}>
			<TooltipProvider>
				<SettingsSync />
				<Router />
			</TooltipProvider>
		</ReduxProvider>
	</StrictMode>
);
