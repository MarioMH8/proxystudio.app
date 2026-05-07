import { selectLang, selectTheme } from '@modules/settings/store';
import { useAppSelector } from '@shared/store';
import i18next from 'i18next';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

function SettingsSync(): ReactNode {
	const theme = useAppSelector(selectTheme);
	const lang = useAppSelector(selectLang);

	useEffect(() => {
		document.body.className = theme;
	}, [theme]);

	useEffect(() => {
		document.documentElement.lang = lang;
		void i18next.changeLanguage(lang);
	}, [lang]);

	return undefined;
}

SettingsSync.displayName = 'SettingsSync';

export { SettingsSync };
