import type { DeepPartial } from '@shared/types';

type UITheme = 'dark' | 'light' | 'system';

interface UISettings {
	autosave: boolean;
	theme: UITheme;
}

interface Settings {
	lang: string;
	ui: UISettings;
}

const Settings = {
	default: (partial?: DeepPartial<Settings>): Settings => {
		const settings = partial ?? {};

		return {
			lang: 'en',
			...settings,
			ui: {
				autosave: true,
				theme: 'system',
				...settings.ui,
			},
		};
	},
	isAutoSaveEnabled: (settings: Settings): boolean => settings.ui.autosave,
	isDarkMode: (settings: Settings): boolean => settings.ui.theme === 'dark',
	isLightMode: (settings: Settings): boolean => settings.ui.theme === 'light',
	lang: ['es', 'en'],
	matchSystem: (settings: Settings): boolean => settings.ui.theme === 'system',
	setAutoSave: (settings: Settings, autosave: boolean): Settings => {
		return {
			...settings,
			ui: {
				...settings.ui,
				autosave,
			},
		};
	},
	setLang: (settings: Settings, lang: string): Settings => {
		return {
			...settings,
			lang,
		};
	},
	setTheme: (settings: Settings, theme: UITheme): Settings => {
		return {
			...settings,
			ui: {
				...settings.ui,
				theme,
			},
		};
	},
	themes: {
		DARK: 'dark' as const,
		LIGHT: 'light' as const,
		SYSTEM: 'system' as const,
	},
};

export type { UITheme };

export { Settings };
