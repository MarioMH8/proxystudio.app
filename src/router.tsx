import { FindLastCardUseCase } from '@modules/card/application';
import useQueryUseCase from '@shared/hexagonal/use-query-use-case';
import Layout from '@shared/layout';
import { useInjection } from 'inversify-react';
import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

const Editor = lazy(() => import('@pages/editor'));
const Gallery = lazy(() => import('@pages/gallery'));

const RedirectToCard = () => {
	const findLastCardUseCase = useInjection<FindLastCardUseCase>(FindLastCardUseCase);
	const { data: card } = useQueryUseCase(findLastCardUseCase, undefined, {
		retry: 0,
	});

	const id = card?.id ?? crypto.randomUUID();

	return (
		<Navigate
			replace
			to={`/${id}/editor`}
		/>
	);
};

const RedirectToEditor = () => {
	return (
		<Navigate
			replace
			to='/editor'
		/>
	);
};

function Router(): ReactNode {
	return (
		<BrowserRouter>
			<Suspense>
				<Routes>
					<Route element={<Layout />}>
						<Route
							element={<Editor />}
							path='/:card/editor'
						/>
						<Route
							element={<Gallery />}
							path='/gallery'
						/>
						<Route
							element={<RedirectToCard />}
							path='/editor'
						/>
					</Route>
					<Route
						element={<RedirectToEditor />}
						path='*'
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

Router.displayName = 'Router';

export default Router;
