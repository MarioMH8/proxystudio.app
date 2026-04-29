import Button from '@components/button';
import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import { Popover, PopoverContent, PopoverTrigger } from '@components/popover';
import { CogIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import ThemeSettings from './theme-settings';

function MenuSettings(): ReactNode {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					dimension='sm'
					icon
					transparent>
					<CogIcon strokeWidth={1} />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<FlexBox
					className='gap-2'
					direction='column'>
					<Heading
						className='mb-2'
						dimension='xs'
						heading='h4'
						tracking='tight'
						uppercase
						variant='muted'
						weight='medium'>
						Settings
					</Heading>
					<ThemeSettings />
				</FlexBox>
			</PopoverContent>
		</Popover>
	);
}

MenuSettings.displayName = 'MenuSettings';

export default MenuSettings;
