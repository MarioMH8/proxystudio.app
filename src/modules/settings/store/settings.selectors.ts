import type { UITheme } from '@modules/settings/domain';
import { Settings } from '@modules/settings/domain';

import { settingsApi } from './settings.api';

type SettingsApiState = Record<typeof settingsApi.reducerPath, ReturnType<typeof settingsApi.reducer>>;

const selectSettingsResult = settingsApi.endpoints.findSettings.select();

function selectSettings(state: SettingsApiState): Settings {
	return selectSettingsResult(state).data ?? Settings.default();
}

function selectTheme(state: SettingsApiState): UITheme {
	return selectSettings(state).ui.theme;
}

function selectLang(state: SettingsApiState): string {
	return selectSettings(state).lang;
}

function selectAutoSave(state: SettingsApiState): boolean {
	return selectSettings(state).ui.autosave;
}

export type { SettingsApiState };
export { selectAutoSave, selectLang, selectSettings, selectTheme };
