import { useEffect } from 'react';

import { REDO_ACTION, UNDO_ACTION } from '../middlewares/undo.middleware';
import { useEditorDispatch } from '../store';

/**
 * Registers global keyboard shortcuts for undo and redo.
 *  - Cmd+Z / Ctrl+Z       → undo
 *  - Cmd+Shift+Z / Ctrl+Shift+Z → redo
 *
 * Must be called inside a component that has access to the editor Redux store.
 */
function useUndoRedoShortcuts(): void {
	const dispatch = useEditorDispatch();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isMac = navigator.platform.startsWith('Mac');
			const modifier = isMac ? event.metaKey : event.ctrlKey;

			if (!modifier) {
				return;
			}

			if (event.key === 'z' && !event.shiftKey) {
				event.preventDefault();
				dispatch({ type: UNDO_ACTION });
			} else if (event.key === 'z' && event.shiftKey) {
				event.preventDefault();
				dispatch({ type: REDO_ACTION });
			}
		};

		globalThis.addEventListener('keydown', handleKeyDown);

		return () => {
			globalThis.removeEventListener('keydown', handleKeyDown);
		};
	}, [dispatch]);
}

export default useUndoRedoShortcuts;
