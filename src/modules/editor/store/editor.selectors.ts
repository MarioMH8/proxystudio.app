import { Card } from '@modules/card/domain';

import { editorApi } from './editor.api';
import type { EditorSliceState, EditorStatus } from './editor.slice';
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

function selectSavedCardId(state: EditorStoreState): string | undefined {
	return state.editor.savedCardId;
}

function selectEditorStatus(state: EditorStoreState): EditorStatus {
	const { card, savedCardId } = state.editor;
	const isSaving = selectSaveMutationResult(state).isLoading;

	if (isSaving) {
		return EDITOR_STATUS.SAVING;
	}

	return card.present.id === savedCardId ? EDITOR_STATUS.SAVED : EDITOR_STATUS.DRAFT;
}

export type { EditorStoreState };
export { selectCanRedo, selectCanUndo, selectCard, selectEditorStatus, selectSavedCardId };
