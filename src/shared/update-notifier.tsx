import { useEffect } from 'react';
import { toast } from 'sonner';
// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';

const PWA_UPDATE_TOAST_ID = 'update-available';

function UpdateNotifier(): undefined {
	useEffect(() => {
		if (!('serviceWorker' in navigator)) {
			return;
		}

		const updateServiceWorker = registerSW({
			onNeedRefresh() {
				toast.info('There is an update available.', {
					action: {
						label: 'Reload',
						onClick: () => void updateServiceWorker(),
					},
					cancel: {
						label: 'Dismiss',
						onClick: () => toast.dismiss(PWA_UPDATE_TOAST_ID),
					},
					duration: Number.POSITIVE_INFINITY,
					id: PWA_UPDATE_TOAST_ID,
				});
			},
		});
	}, []);

	return undefined;
}

UpdateNotifier.displayName = 'UpdateNotifier';

export default UpdateNotifier;
