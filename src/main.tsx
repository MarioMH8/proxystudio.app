import './index.css';

import Layout from '@shared/layout';
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

const Creator = lazy(() => import('@pages/creator'));
const Gallery = lazy(() => import('@pages/gallery'));

const root = document.querySelector('#root');

if (!root) {
	throw new Error('#root not found');
}

const redirect = (
	<Navigate
		replace
		to='/'
	/>
);

createRoot(root).render(
	<StrictMode>
		<BrowserRouter>
			<Suspense>
				<Routes>
					<Route
						element={<Layout />}
						path='/'>
						<Route
							element={<Creator />}
							index
						/>
					</Route>
					<Route
						element={<Layout />}
						path='/gallery'>
						<Route
							element={<Gallery />}
							index
						/>
					</Route>
					<Route
						element={redirect}
						path='*'
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	</StrictMode>
);
