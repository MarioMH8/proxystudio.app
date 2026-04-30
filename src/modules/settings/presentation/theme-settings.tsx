import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import SegmentControl from '@components/segment-control/segment-control';
import SegmentControlItem from '@components/segment-control/segment-control-item';
import { Settings } from '@modules/settings/domain';
import { useSettingsContext } from '@modules/settings/store';
import { MonitorDotIcon, MoonIcon, SunIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = 15;
const STROKE_WIDTH = 1;

function ThemeSettings(): ReactNode {
	const { setTheme, settings } = useSettingsContext();
	const { t } = useTranslation();

	return (
		<FlexBox
			className='gap-2'
			direction='column'
			items='start'>
			<Heading
				dimension='sm'
				heading='h4'
				variant='muted'
				weight='light'>
				{t('settings.theme.title')}
			</Heading>
			<SegmentControl
				aria-label={t('settings.theme.title')}
				role='group'>
				<SegmentControlItem
					aria-pressed={Settings.matchSystem(settings)}
					isActive={Settings.matchSystem(settings)}
					onClick={() => setTheme(Settings.themes.SYSTEM)}>
					<MonitorDotIcon
						size={ICON_SIZE}
						strokeWidth={STROKE_WIDTH}
					/>
					{t('settings.theme.options.system')}
				</SegmentControlItem>
				<SegmentControlItem
					aria-pressed={Settings.isLightMode(settings)}
					isActive={Settings.isLightMode(settings)}
					onClick={() => setTheme(Settings.themes.LIGHT)}>
					<SunIcon
						size={ICON_SIZE}
						strokeWidth={STROKE_WIDTH}
					/>
					{t('settings.theme.options.light')}
				</SegmentControlItem>
				<SegmentControlItem
					aria-pressed={Settings.isDarkMode(settings)}
					isActive={Settings.isDarkMode(settings)}
					onClick={() => setTheme(Settings.themes.DARK)}>
					<MoonIcon
						size={ICON_SIZE}
						strokeWidth={STROKE_WIDTH}
					/>
					{t('settings.theme.options.dark')}
				</SegmentControlItem>
			</SegmentControl>
		</FlexBox>
	);
}

ThemeSettings.displayName = 'ThemeSettings';

export default ThemeSettings;
