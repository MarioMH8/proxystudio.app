type UITheme = 'dark' | 'light' | 'system';

interface UISettings {
	theme: UITheme;
}

interface Settings {
	lang: string;
	ui: UISettings;
}

const Settings = {
	default: (partial?: Partial<Settings>): Settings => {
		const settings = partial ?? {};

		return {
			lang: 'en',
			...settings,
			ui: {
				theme: 'system',
				...settings.ui,
			},
		};
	},
	isDarkMode: (settings: Settings): boolean => settings.ui.theme === 'dark',
	isLightMode: (settings: Settings): boolean => settings.ui.theme === 'light',
	key: 'settings',
	lang: ['es', 'en'],
	matchSystem: (settings: Settings): boolean => settings.ui.theme === 'system',
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
