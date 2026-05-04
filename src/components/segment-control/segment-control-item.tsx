import type { ButtonProperties } from '@components/button';
import Button from '@components/button';
import hover from '@components/hover';
import rounded from '@components/rounded';
import { cn } from '@shared/cva';
import type { ReactNode } from 'react';

type SegmentControlItemProperties = ButtonProperties & {
	isActive?: boolean;
};

function SegmentControlItem({ dimension = 'sm', isActive, ...properties }: SegmentControlItemProperties): ReactNode {
	return (
		<Button
			className={cn(
				rounded({ context: 'inner', dimension: 'lg' }),
				!isActive && cn('opacity-60 hover:opacity-100', hover({ variant: 'inherit' }))
			)}
			dimension={dimension}
			transparent={!isActive}
			{...properties}
		/>
	);
}

SegmentControlItem.displayName = 'SegmentControlItem';

export type { SegmentControlItemProperties };

export default SegmentControlItem;
