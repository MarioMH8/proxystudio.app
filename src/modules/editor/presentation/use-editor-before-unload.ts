import { selectHasPendingChanges } from '@modules/editor/store';
import { useAppSelector } from '@shared/store';
import { useEffect } from 'react';

function useEditorBeforeUnload(): void {
	const hasPendingChanges = useAppSelector(selectHasPendingChanges);

	useEffect(() => {
		if (!hasPendingChanges) {
			return;
		}

		const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
			event.preventDefault();
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [hasPendingChanges]);
}

export default useEditorBeforeUnload;
