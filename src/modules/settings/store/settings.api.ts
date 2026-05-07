import { FindSettingsUseCase, SaveSettingsUseCase } from '@modules/settings/application';
import { Settings } from '@modules/settings/domain';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import container from '@shared/container';

const findSettingsUseCase = container.get(FindSettingsUseCase);
const saveSettingsUseCase = container.get(SaveSettingsUseCase);

const settingsApi = createApi({
	baseQuery: fakeBaseQuery(),
	endpoints: build => ({
		findSettings: build.query<Settings, void>({
			keepUnusedDataFor: Infinity,
			queryFn: async () => {
				try {
					const data = await findSettingsUseCase.execute();

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
					await saveSettingsUseCase.execute(settings);

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
