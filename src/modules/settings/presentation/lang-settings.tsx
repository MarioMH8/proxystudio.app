import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import Select from '@components/select';
import { Settings } from '@modules/settings/domain';
import { useSettingsContext } from '@modules/settings/store';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

function LangSettings(): ReactNode {
	const { setLang, settings } = useSettingsContext();
	const { t } = useTranslation();

	const options = Settings.lang
		.map(lang => [lang, t(`lang.${lang}`)] as const)
		.toSorted((a1, a2) => a1[1].localeCompare(a2[1]));

	return (
		<FlexBox
			className='gap-2'
			direction='row'
			items='center'>
			<Heading
				dimension='sm'
				heading='h4'
				variant='muted'
				weight='light'>
				{t('settings.lang.title')}
			</Heading>
			<Select
				dimension='sm'
				onChange={event => setLang(event.target.value)}
				value={settings.lang}>
				{options.map(([lang, value]) => (
					<option
						key={`lang-${lang}`}
						value={lang}>
						{value}
					</option>
				))}
			</Select>
		</FlexBox>
	);
}

LangSettings.displayName = 'LangSettings';

export default LangSettings;
