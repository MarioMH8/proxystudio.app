import {
	EDITOR_TOOL,
	editorSlice,
	selectCanRedo,
	selectCanUndo,
	selectCard,
	useSaveCardMutation,
} from '@modules/editor/store';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { toggleFullscreen } from '@shared/toggle-fullscreen';
import { useHotkeys } from 'react-hotkeys-hook';

import { EDITOR_ID } from './viewport/const';

function useEditorHotkeys(): void {
	const dispatch = useAppDispatch();
	const canUndo = useAppSelector(selectCanUndo);
	const canRedo = useAppSelector(selectCanRedo);
	const card = useAppSelector(selectCard);
	const [saveCard] = useSaveCardMutation({ fixedCacheKey: 'save-card' });

	useHotkeys(
		's',
		event => {
			event.preventDefault();
			dispatch(editorSlice.actions.setViewportTool(EDITOR_TOOL.SELECT));
		},
		{ preventDefault: true },
		[dispatch]
	);

	useHotkeys(
		'h',
		event => {
			event.preventDefault();
			dispatch(editorSlice.actions.setViewportTool(EDITOR_TOOL.PAN));
		},
		{ preventDefault: true },
		[dispatch]
	);

	useHotkeys(
		'-,subtract',
		event => {
			event.preventDefault();
			dispatch(editorSlice.actions.zoomOutViewport());
		},
		{ preventDefault: true },
		[dispatch]
	);

	useHotkeys(
		'=,+,add',
		event => {
			event.preventDefault();
			dispatch(editorSlice.actions.zoomInViewport());
		},
		{ preventDefault: true },
		[dispatch]
	);

	useHotkeys(
		'0',
		event => {
			event.preventDefault();
			dispatch(editorSlice.actions.resetViewport({ markAsInteracted: false }));
		},
		{ preventDefault: true },
		[dispatch]
	);

	useHotkeys(
		'f',
		event => {
			event.preventDefault();
			toggleFullscreen(EDITOR_ID);
		},
		{ preventDefault: true },
		[]
	);

	useHotkeys(
		'meta+z,ctrl+z',
		event => {
			event.preventDefault();

			if (canUndo) {
				dispatch(editorSlice.actions.undoCardChanges());
			}
		},
		{ enableOnFormTags: true, preventDefault: true },
		[canUndo, dispatch]
	);

	useHotkeys(
		'meta+shift+z,ctrl+shift+z',
		event => {
			event.preventDefault();

			if (canRedo) {
				dispatch(editorSlice.actions.redoCardChanges());
			}
		},
		{ enableOnFormTags: true, preventDefault: true },
		[canRedo, dispatch]
	);

	useHotkeys(
		'meta+s,ctrl+s',
		event => {
			event.preventDefault();
			void saveCard(card);
		},
		{ enableOnFormTags: true, preventDefault: true },
		[card, saveCard]
	);
}

export default useEditorHotkeys;
