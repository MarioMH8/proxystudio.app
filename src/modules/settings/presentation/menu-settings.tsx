import Button from '@components/button';
import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import { Popover, PopoverContent, PopoverTrigger } from '@components/popover';
import { CogIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import LangSettings from './lang-settings';
import ThemeSettings from './theme-settings';

function MenuSettings(): ReactNode {
	const { t } = useTranslation();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					aria-label={t('settings.title')}
					dimension='sm'
					icon
					transparent>
					<CogIcon strokeWidth={1} />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<FlexBox
					className='gap-4'
					direction='column'
					items='stretch'>
					<Heading
						dimension='sm'
						heading='h3'
						tracking='tight'
						uppercase
						variant='muted'
						weight='medium'>
						{t('settings.title')}
					</Heading>
					<ThemeSettings />
					<LangSettings />
				</FlexBox>
			</PopoverContent>
		</Popover>
	);
}

MenuSettings.displayName = 'MenuSettings';

export default MenuSettings;
