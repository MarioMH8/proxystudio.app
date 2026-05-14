import Button from '@components/button';
import { DownloadIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface DownloadCardButtonProperties {
	onDownloadCard: () => void;
}

function DownloadCardButton({ onDownloadCard }: DownloadCardButtonProperties): ReactNode {
	const { t } = useTranslation();

	return (
		<Button
			aria-label={t('editor.downloadCard')}
			dimension='sm'
			icon
			onClick={onDownloadCard}
			transparent
			type='button'>
			<DownloadIcon />
		</Button>
	);
}

DownloadCardButton.displayName = 'DownloadCardButton';

export default DownloadCardButton;
