import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogOverlay,
	AlertDialogTitle,
} from '@components/alert-dialog';
import Button from '@components/button';
import FlexBox from '@components/flex-box';
import Heading from '@components/heading';
import Span from '@components/span';
import { selectHasPendingChanges } from '@modules/editor/store';
import { useAppSelector } from '@shared/store';
import { PlusIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface NewCardButtonProperties {
	onCreateNewCard: () => void;
}

function NewCardButton({ onCreateNewCard }: NewCardButtonProperties): ReactNode {
	const hasPendingChanges = useAppSelector(selectHasPendingChanges);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const { t } = useTranslation();

	function handleNewCardClick(): void {
		if (hasPendingChanges) {
			setIsConfirmDialogOpen(true);

			return;
		}

		onCreateNewCard();
	}

	return (
		<AlertDialog
			onOpenChange={setIsConfirmDialogOpen}
			open={isConfirmDialogOpen}>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<FlexBox
					className='gap-4'
					direction='column'
					items='stretch'>
					<FlexBox
						className='gap-2'
						direction='column'
						items='start'>
						<Heading
							asChild
							dimension='base'
							heading='h3'
							tracking='tight'
							weight='semibold'>
							<AlertDialogTitle>{t('editor.newCardConfirm.title')}</AlertDialogTitle>
						</Heading>
						<Span
							asChild
							dimension='sm'
							variant='muted'>
							<AlertDialogDescription>{t('editor.newCardConfirm.description')}</AlertDialogDescription>
						</Span>
					</FlexBox>
					<FlexBox
						className='gap-2'
						justify='end'>
						<AlertDialogCancel asChild>
							<Button
								dimension='sm'
								transparent>
								{t('editor.newCardConfirm.cancel')}
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button
								dimension='sm'
								onClick={onCreateNewCard}
								variant='danger'>
								{t('editor.newCardConfirm.confirm')}
							</Button>
						</AlertDialogAction>
					</FlexBox>
				</FlexBox>
			</AlertDialogContent>
			<Button
				aria-label={t('editor.newCard')}
				dimension='sm'
				icon
				onClick={handleNewCardClick}
				transparent>
				<PlusIcon />
			</Button>
		</AlertDialog>
	);
}

NewCardButton.displayName = 'NewCardButton';

export default NewCardButton;
