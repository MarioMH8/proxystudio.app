import FlexBox from '@components/flex-box';
import Label from '@components/label';
import Select from '@components/select';
import { Settings } from '@modules/settings/domain';
import { selectSettings, useSaveSettingsMutation } from '@modules/settings/store';
import { useAppSelector } from '@shared/store';
import type { ReactNode } from 'react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

function LangSettings(): ReactNode {
	const settings = useAppSelector(selectSettings);
	const [saveSettings] = useSaveSettingsMutation();
	const { t } = useTranslation();
	const selectId = useId();

	const options = Settings.lang
		.map(lang => [lang, t(`lang.${lang}`)] as const)
		.toSorted((a1, a2) => a1[1].localeCompare(a2[1]));

	return (
		<FlexBox
			className='gap-2'
			direction='row'
			items='center'>
			<Label
				dimension='sm'
				htmlFor={selectId}
				variant='muted'
				weight='light'>
				{t('settings.lang.title')}
			</Label>
			<Select
				dimension='sm'
				id={selectId}
				onChange={event => void saveSettings(Settings.setLang(settings, event.target.value))}
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
