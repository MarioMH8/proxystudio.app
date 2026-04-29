import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import SegmentControl from '@components/segment-control/segment-control';
import SegmentControlItem from '@components/segment-control/segment-control-item';
import { Settings } from '@modules/settings/domain';
import { useSettingsContext } from '@modules/settings/store';
import { MonitorDotIcon, MoonIcon, SunIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const ICON_SIZE = 15;
const STROKE_WIDTH = 1;

function ThemeSettings(): ReactNode {
	const { setTheme, settings } = useSettingsContext();

	return (
		<FlexBox
			className='gap-2'
			direction='column'
			items='start'>
			<Heading
				dimension='xs'
				heading='h4'
				variant='muted'
				weight='light'>
				Theme
			</Heading>
			<SegmentControl>
				<SegmentControlItem
					isActive={Settings.matchSystem(settings)}
					onClick={() => setTheme(Settings.themes.SYSTEM)}>
					<MonitorDotIcon
						size={ICON_SIZE}
						strokeWidth={STROKE_WIDTH}
					/>
					System
				</SegmentControlItem>
				<SegmentControlItem
					isActive={Settings.isLightMode(settings)}
					onClick={() => setTheme(Settings.themes.LIGHT)}>
					<SunIcon
						size={ICON_SIZE}
						strokeWidth={STROKE_WIDTH}
					/>
					Light
				</SegmentControlItem>
				<SegmentControlItem
					isActive={Settings.isDarkMode(settings)}
					onClick={() => setTheme(Settings.themes.DARK)}>
					<MoonIcon
						size={ICON_SIZE}
						strokeWidth={STROKE_WIDTH}
					/>
					Dark
				</SegmentControlItem>
			</SegmentControl>
		</FlexBox>
	);
}

ThemeSettings.displayName = 'ThemeSettings';

export default ThemeSettings;
