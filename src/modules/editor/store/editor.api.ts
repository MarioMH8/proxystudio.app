import { FindCardUseCase, FindLastCardUseCase, SaveCardUseCase } from '@modules/card/application';
import { Card } from '@modules/card/domain';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getContainer } from '@shared/store/inversify-middleware';

interface FindCardParameters {
	id: string | undefined;
}

const editorApi = createApi({
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		findCard: build.query<Card, FindCardParameters>({
			queryFn: async ({ id }) => {
				const resolvedId = id ?? '';

				try {
					const useCase = getContainer().get(FindCardUseCase);
					const data = await useCase.execute({ id: resolvedId });

					return { data: data ?? Card.default({ id: resolvedId }) };
				} catch {
					return { data: Card.default({ id: resolvedId }) };
				}
			},
		}),
		// eslint-disable-next-line typescript/no-invalid-void-type
		findLastCard: build.query<Card, void>({
			queryFn: async () => {
				try {
					const useCase = getContainer().get(FindLastCardUseCase);
					const data = await useCase.execute();

					return { data: data ?? Card.default() };
				} catch {
					return { data: Card.default() };
				}
			},
		}),
		saveCard: build.mutation<undefined, Card>({
			onQueryStarted: async (card, { dispatch, queryFulfilled }) => {
				const patch = dispatch(editorApi.util.updateQueryData('findCard', { id: card.id }, () => card));

				try {
					await queryFulfilled;
				} catch {
					patch.undo();
				}
			},
			queryFn: async card => {
				try {
					const useCase = getContainer().get(SaveCardUseCase);
					await useCase.execute(card);

					return { data: undefined };
				} catch (error) {
					return { error };
				}
			},
		}),
	}),
	reducerPath: 'editorApi',
	tagTypes: ['Card'],
});

const { useFindCardQuery, useFindLastCardQuery, useSaveCardMutation } = editorApi;

export type { FindCardParameters };
export { editorApi, useFindCardQuery, useFindLastCardQuery, useSaveCardMutation };
