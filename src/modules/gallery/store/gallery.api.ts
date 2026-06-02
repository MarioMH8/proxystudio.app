import { SearchCardUseCase } from '@modules/card/application';
import { Card } from '@modules/card/domain';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import container from '@shared/container';

interface SearchCardsParameters {
	limit?: number;
	offset?: number;
	sort?: 'createdAt' | 'name' | 'updatedAt';
	sortDirection?: 'asc' | 'desc';
	term?: string;
}

const searchCardUseCase = container.get(SearchCardUseCase);

const galleryApi = createApi({
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		searchCards: build.query<Card[], SearchCardsParameters>({
			queryFn: async parameters => {
				try {
					const data = await searchCardUseCase.execute(parameters);

					return { data };
				} catch {
					return { data: [] };
				}
			},
		}),
	}),
	reducerPath: 'galleryApi',
	tagTypes: ['Card'],
});

const { useLazySearchCardsQuery } = galleryApi;

export type { SearchCardsParameters };
export { galleryApi, useLazySearchCardsQuery };
