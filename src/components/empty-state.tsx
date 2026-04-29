import FlexBox from '@components/flex-box';
import { cn } from '@shared/cva';
import type { ElementType, ReactNode } from 'react';

interface EmptyStateProps {
	className?: string;
	icon?: ElementType;
	iconSize?: number;
	message: string;
}

function EmptyState({ className, icon: Icon, iconSize = 32, message }: EmptyStateProps): ReactNode {
	return (
		<FlexBox
			className={cn('gap-3 py-8 text-center text-foreground-500', className)}
			direction='column'>
			{Icon ? (
				<Icon
					aria-hidden='true'
					size={iconSize}
				/>
			) : undefined}
			<p>{message}</p>
		</FlexBox>
	);
}

EmptyState.displayName = 'EmptyState';

export type { EmptyStateProps };

export default EmptyState;
