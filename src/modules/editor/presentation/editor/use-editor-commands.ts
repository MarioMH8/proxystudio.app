import type { Card } from '@modules/card/domain';
import { EDITOR_TOOL, editorSlice, useSaveCardMutation } from '@modules/editor/store';
import { useAppDispatch } from '@shared/store';
import { toggleFullscreen } from '@shared/toggle-fullscreen';

import { EDITOR_ID } from '../viewport/const';

type EditorTool = (typeof EDITOR_TOOL)[keyof typeof EDITOR_TOOL];

interface EditorCommandsResult {
	redo: () => void;
	resetViewport: () => void;
	saveCard: (card: Card) => void;
	setViewportTool: (tool: EditorTool) => void;
	toggleFullscreen: () => void;
	undo: () => void;
	zoomIn: () => void;
	zoomOut: () => void;
}

function useEditorCommands(): EditorCommandsResult {
	const dispatch = useAppDispatch();
	const [saveCardMutation] = useSaveCardMutation({ fixedCacheKey: 'save-card' });

	function setViewportTool(tool: EditorTool): void {
		dispatch(editorSlice.actions.setViewportTool(tool));
	}

	function undo(): void {
		dispatch(editorSlice.actions.undoCardChanges());
	}

	function redo(): void {
		dispatch(editorSlice.actions.redoCardChanges());
	}

	function zoomOut(): void {
		dispatch(editorSlice.actions.zoomOutViewport());
	}

	function zoomIn(): void {
		dispatch(editorSlice.actions.zoomInViewport());
	}

	function resetViewport(): void {
		dispatch(editorSlice.actions.resetViewport({ markAsInteracted: false }));
	}

	function toggleFullscreenCommand(): void {
		toggleFullscreen(EDITOR_ID);
	}

	function saveCard(card: Card): void {
		void saveCardMutation(card);
	}

	return {
		redo,
		resetViewport,
		saveCard,
		setViewportTool,
		toggleFullscreen: toggleFullscreenCommand,
		undo,
		zoomIn,
		zoomOut,
	};
}

export { type EditorTool };

export default useEditorCommands;
