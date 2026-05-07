import { FindCardUseCase, FindLastCardUseCase, SaveCardUseCase } from '@modules/card/application';
import { Card } from '@modules/card/domain';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import container from '@shared/container';

interface FindCardParameters {
	id: string | undefined;
}

const findCardUseCase = container.get(FindCardUseCase);
const saveCardUseCase = container.get(SaveCardUseCase);
const findLastCardUseCase = container.get(FindLastCardUseCase);

const editorApi = createApi({
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		findCard: build.query<Card, FindCardParameters>({
			queryFn: async ({ id }) => {
				const resolvedId = id ?? '';

				try {
					const data = await findCardUseCase.execute({ id: resolvedId });

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
					const data = await findLastCardUseCase.execute();

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
					await saveCardUseCase.execute(card);

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
