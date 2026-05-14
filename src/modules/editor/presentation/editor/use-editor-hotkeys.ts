import { EDITOR_TOOL, selectCanRedo, selectCanUndo, selectCard } from '@modules/editor/store';
import { useAppSelector } from '@shared/store';
import { useHotkeys } from 'react-hotkeys-hook';

import useLayerSelectionCommands from '../layer/use-layer-selection-commands';
import useEditorCommands from './use-editor-commands';

function useEditorHotkeys(): void {
	const canUndo = useAppSelector(selectCanUndo);
	const canRedo = useAppSelector(selectCanRedo);
	const card = useAppSelector(selectCard);
	const { redo, resetViewport, saveCard, setViewportTool, toggleFullscreen, undo, zoomIn, zoomOut } =
		useEditorCommands();
	const {
		canDeleteSelection,
		canGroupSelection,
		canToggleSelectionHidden,
		deleteSelection,
		groupSelection,
		toggleSelectionHidden,
	} = useLayerSelectionCommands();

	useHotkeys(
		's',
		event => {
			event.preventDefault();
			setViewportTool(EDITOR_TOOL.SELECT);
		},
		{ preventDefault: true },
		[setViewportTool]
	);

	useHotkeys(
		'h',
		event => {
			event.preventDefault();
			setViewportTool(EDITOR_TOOL.PAN);
		},
		{ preventDefault: true },
		[setViewportTool]
	);

	useHotkeys(
		'-,subtract',
		event => {
			event.preventDefault();
			zoomOut();
		},
		{ preventDefault: true },
		[zoomOut]
	);

	useHotkeys(
		'=,+,add',
		event => {
			event.preventDefault();
			zoomIn();
		},
		{ preventDefault: true },
		[zoomIn]
	);

	useHotkeys(
		'0',
		event => {
			event.preventDefault();
			resetViewport();
		},
		{ preventDefault: true },
		[resetViewport]
	);

	useHotkeys(
		'f',
		event => {
			event.preventDefault();
			toggleFullscreen();
		},
		{ preventDefault: true },
		[toggleFullscreen]
	);

	useHotkeys(
		'meta+z,ctrl+z',
		event => {
			event.preventDefault();

			if (canUndo) {
				undo();
			}
		},
		{ enableOnFormTags: true, preventDefault: true },
		[canUndo, undo]
	);

	useHotkeys(
		'meta+shift+z,ctrl+shift+z',
		event => {
			event.preventDefault();

			if (canRedo) {
				redo();
			}
		},
		{ enableOnFormTags: true, preventDefault: true },
		[canRedo, redo]
	);

	useHotkeys(
		'meta+s,ctrl+s',
		event => {
			event.preventDefault();
			saveCard(card);
		},
		{ enableOnFormTags: true, preventDefault: true },
		[card, saveCard]
	);

	useHotkeys(
		'backspace,del',
		event => {
			if (!canDeleteSelection) {
				return;
			}

			event.preventDefault();
			deleteSelection();
		},
		{},
		[canDeleteSelection, deleteSelection]
	);

	useHotkeys(
		'meta+shift+g,ctrl+shift+g',
		event => {
			if (!canGroupSelection) {
				return;
			}

			event.preventDefault();
			groupSelection();
		},
		{},
		[canGroupSelection, groupSelection]
	);

	useHotkeys(
		'meta+shift+h,ctrl+shift+h',
		event => {
			if (!canToggleSelectionHidden) {
				return;
			}

			event.preventDefault();
			toggleSelectionHidden();
		},
		{},
		[canToggleSelectionHidden, toggleSelectionHidden]
	);
}

export default useEditorHotkeys;
