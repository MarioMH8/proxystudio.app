import { FindSettingsUseCase, SaveSettingsUseCase } from '@modules/settings/application';
import type { UITheme } from '@modules/settings/domain';
import { Settings } from '@modules/settings/domain';
import { useMutationUseCase, useQueryUseCase } from '@shared/hexagonal';
import i18next from 'i18next';
import { useInjection } from 'inversify-react';
import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect } from 'react';

interface SettingsState {
	setLang: (theme: string) => void;
	setTheme: (theme: UITheme) => void;
	settings: Settings;
}

interface SettingsProviderProperties {
	children: ReactNode;
}

const SettingsContext = createContext<SettingsState>({} as SettingsState);

const useSettingsContext = (): SettingsState => useContext(SettingsContext);

const SettingsProvider: FC<SettingsProviderProperties> = ({ children }) => {
	const findSettingsUseCase = useInjection<FindSettingsUseCase>(FindSettingsUseCase);
	const saveSettingsUseCase = useInjection<SaveSettingsUseCase>(SaveSettingsUseCase);

	const { data: settings = Settings.default() } = useQueryUseCase(findSettingsUseCase);
	const { mutate: saveSettings } = useMutationUseCase(saveSettingsUseCase);

	const setTheme = useCallback(
		(theme: UITheme) => saveSettings(Settings.setTheme(settings, theme)),
		[settings, saveSettings]
	);

	const setLang = useCallback(
		(lang: string) => saveSettings(Settings.setLang(settings, lang)),
		[settings, saveSettings]
	);

	useEffect(() => {
		document.body.className = settings.ui.theme;
	}, [settings.ui.theme]);

	useEffect(() => {
		document.documentElement.lang = settings.lang;
		void i18next.changeLanguage(settings.lang);
	}, [settings.lang]);

	return <SettingsContext.Provider value={{ setLang, setTheme, settings }}>{children}</SettingsContext.Provider>;
};

export { SettingsProvider, useSettingsContext };
