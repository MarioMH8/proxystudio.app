import { FindSettingsUseCase, SaveSettingsUseCase } from '@modules/settings/application';
import { Settings } from '@modules/settings/domain';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getContainer } from '@shared/store/inversify-middleware';

const settingsApi = createApi({
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		// eslint-disable-next-line typescript/no-invalid-void-type
		findSettings: build.query<Settings, void>({
			keepUnusedDataFor: Infinity,
			queryFn: async () => {
				try {
					const useCase = getContainer().get(FindSettingsUseCase);
					const data = await useCase.execute();

					return { data };
				} catch (error) {
					return { error };
				}
			},
		}),
		saveSettings: build.mutation<undefined, Settings>({
			onQueryStarted: async (settings, { dispatch, queryFulfilled }) => {
				const patch = dispatch(settingsApi.util.updateQueryData('findSettings', undefined, () => settings));

				try {
					await queryFulfilled;
				} catch {
					patch.undo();
				}
			},
			queryFn: async settings => {
				try {
					const useCase = getContainer().get(SaveSettingsUseCase);
					await useCase.execute(settings);

					return { data: undefined };
				} catch (error) {
					return { error };
				}
			},
		}),
	}),
	reducerPath: 'settingsApi',
	tagTypes: ['Settings'],
});

const { useFindSettingsQuery, useSaveSettingsMutation } = settingsApi;

export { settingsApi, useFindSettingsQuery, useSaveSettingsMutation };
