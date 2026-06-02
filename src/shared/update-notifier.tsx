import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';

const PWA_UPDATE_TOAST_ID = 'update-available';

function UpdateNotifier(): undefined {
	const { t } = useTranslation();

	useEffect(() => {
		if (!('serviceWorker' in navigator)) {
			return;
		}

		const updateServiceWorker = registerSW({
			onNeedRefresh() {
				toast.info(t('updateNotifier.message'), {
					action: {
						label: t('updateNotifier.reload'),
						onClick: () => void updateServiceWorker(),
					},
					cancel: {
						label: t('updateNotifier.dismiss'),
						onClick: () => toast.dismiss(PWA_UPDATE_TOAST_ID),
					},
					duration: Number.POSITIVE_INFINITY,
					id: PWA_UPDATE_TOAST_ID,
				});
			},
		});
	}, [t]);

	return undefined;
}

UpdateNotifier.displayName = 'UpdateNotifier';

export default UpdateNotifier;
