import './index.css';
import 'reflect-metadata';
import '@shared/i18n';

import { TooltipProvider } from '@components/tooltip';
import container from '@shared/container';
import queryClient from '@shared/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'inversify-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { SettingsProvider } from './modules/settings/store';
import Router from './router';

const root = document.querySelector('#root');

if (!root) {
	throw new Error('#root not found');
}

createRoot(root).render(
	<StrictMode>
		<Provider container={container}>
			<QueryClientProvider client={queryClient}>
				<TooltipProvider>
					<SettingsProvider>
						<Router />
					</SettingsProvider>
				</TooltipProvider>
			</QueryClientProvider>
		</Provider>
	</StrictMode>
);
