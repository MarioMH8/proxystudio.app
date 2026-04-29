import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const t = await i18n
	.use(initReactI18next)
	.use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
	.use(LanguageDetector)
	.on('failedLoading', (_language, _namespace, message) => console.error(message))
	.init({
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	});

export default t;
