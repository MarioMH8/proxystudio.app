import { Card } from '@modules/card/domain';

import { editorApi } from './editor.api';
import type { EditorSliceState, EditorStatus, EditorTool, ViewportOffset } from './editor.slice';
import { EDITOR_STATUS } from './editor.slice';

type EditorApiState = Record<typeof editorApi.reducerPath, ReturnType<typeof editorApi.reducer>>;

type EditorStoreState = EditorApiState & {
	editor: EditorSliceState;
};

const selectSaveMutationResult = editorApi.endpoints.saveCard.select('save-card');

function selectCard(state: EditorStoreState): Card {
	return state.editor.card.present;
}

function selectCanRedo(state: EditorStoreState): boolean {
	return state.editor.card.future.length > 0;
}

function selectCanUndo(state: EditorStoreState): boolean {
	return state.editor.card.past.length > 0;
}

function selectExpandedGroupIds(state: EditorStoreState): string[] {
	return state.editor.layerPanel.expandedGroupIds;
}

function selectSelectedLayerIds(state: EditorStoreState): string[] {
	return state.editor.layerPanel.selectedLayerIds;
}

function selectSavedCardId(state: EditorStoreState): string | undefined {
	return state.editor.savedCardId;
}

function selectIsCardLoading(state: EditorStoreState): boolean {
	return state.editor.isCardLoading;
}

function selectViewportHasInteracted(state: EditorStoreState): boolean {
	return state.editor.viewport.hasInteracted;
}

function selectViewportOffset(state: EditorStoreState): ViewportOffset {
	return state.editor.viewport.offset;
}

function selectViewportTool(state: EditorStoreState): EditorTool {
	return state.editor.viewport.tool;
}

function selectViewportZoom(state: EditorStoreState): number {
	return state.editor.viewport.zoom;
}

function selectEditorStatus(state: EditorStoreState): EditorStatus {
	const { card, isCardLoading, savedCardId, savedCardUpdatedAt } = state.editor;
	const isSaving = selectSaveMutationResult(state).isLoading;

	if (isCardLoading) {
		return EDITOR_STATUS.LOADING;
	}

	if (isSaving) {
		return EDITOR_STATUS.SAVING;
	}

	const isSaved = card.present.id === savedCardId && card.present.metadata.updatedAt === savedCardUpdatedAt;

	return isSaved ? EDITOR_STATUS.SAVED : EDITOR_STATUS.DRAFT;
}

function selectHasPendingChanges(state: EditorStoreState): boolean {
	const status = selectEditorStatus(state);

	return status === EDITOR_STATUS.DRAFT || status === EDITOR_STATUS.SAVING;
}

export type { EditorStoreState };
export {
	selectCanRedo,
	selectCanUndo,
	selectCard,
	selectEditorStatus,
	selectExpandedGroupIds,
	selectHasPendingChanges,
	selectIsCardLoading,
	selectSavedCardId,
	selectSelectedLayerIds,
	selectViewportHasInteracted,
	selectViewportOffset,
	selectViewportTool,
	selectViewportZoom,
};
