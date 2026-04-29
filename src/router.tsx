import Layout from '@shared/layout';
import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

const Editor = lazy(() => import('@pages/editor'));
const Gallery = lazy(() => import('@pages/gallery'));

const redirect = (
	<Navigate
		replace
		to='/'
	/>
);

function Router(): ReactNode {
	return (
		<BrowserRouter>
			<Suspense>
				<Routes>
					<Route element={<Layout />}>
						<Route
							element={<Editor />}
							index
						/>
						<Route
							element={<Gallery />}
							path='/gallery'
						/>
						<Route
							element={redirect}
							path='*'
						/>
					</Route>
					<Route
						element={redirect}
						path='*'
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

Router.displayName = 'Router';

export default Router;
