import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import SegmentControl from '@components/segment-control/segment-control';
import SegmentControlItem from '@components/segment-control/segment-control-item';
import { Settings } from '@modules/settings/domain';
import { selectSettings, useSaveSettingsMutation } from '@modules/settings/store';
import { useAppSelector } from '@shared/store';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

function AutosaveSettings(): ReactNode {
	const settings = useAppSelector(selectSettings);
	const [saveSettings] = useSaveSettingsMutation();
	const { t } = useTranslation();
	const isAutoSaveEnabled = Settings.isAutoSaveEnabled(settings);

	return (
		<FlexBox
			direction='column'
			items='start'>
			<Heading
				dimension='sm'
				heading='h4'
				variant='muted'
				weight='light'>
				{t('settings.autosave.title')}
			</Heading>
			<SegmentControl
				aria-label={t('settings.autosave.title')}
				className='sm:w-full'
				role='group'>
				<SegmentControlItem
					aria-pressed={isAutoSaveEnabled}
					isActive={isAutoSaveEnabled}
					onClick={() => void saveSettings(Settings.setAutoSave(settings, true))}>
					{t('settings.autosave.options.enabled')}
				</SegmentControlItem>
				<SegmentControlItem
					aria-pressed={!isAutoSaveEnabled}
					isActive={!isAutoSaveEnabled}
					onClick={() => void saveSettings(Settings.setAutoSave(settings, false))}>
					{t('settings.autosave.options.disabled')}
				</SegmentControlItem>
			</SegmentControl>
		</FlexBox>
	);
}

AutosaveSettings.displayName = 'AutosaveSettings';

export default AutosaveSettings;
