import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const LOCALE_LOADERS: Record<string, Record<string, () => Promise<unknown>>> = {
	en: {
		translation: () => import('./locales/en/translation.json'),
	},
	es: {
		translation: () => import('./locales/es/translation.json'),
	},
} as const;

const t = await i18n
	.use(initReactI18next)
	.use(
		resourcesToBackend((language: string, namespace: string) => {
			const languageLoaders = LOCALE_LOADERS[language];

			if (!languageLoaders) {
				return Promise.reject(new Error(`No locale loader for ${language}/${namespace}`));
			}

			const namespaceLoader = languageLoaders[namespace];

			if (!namespaceLoader) {
				return Promise.reject(new Error(`No locale loader for ${language}/${namespace}`));
			}

			return namespaceLoader();
		})
	)
	.use(LanguageDetector)
	.on('failedLoading', (_language, _namespace, message) => console.error(message))
	.init({
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	});

export default t;
