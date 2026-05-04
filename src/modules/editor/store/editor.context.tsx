import { FindCardUseCase, SaveCardUseCase } from '@modules/card/application';
import { Card } from '@modules/card/domain';
import { useMutationUseCase, useQueryUseCase } from '@shared/hexagonal';
import { useHistoryReducer } from '@shared/hooks/history';
import { useInjection } from 'inversify-react';
import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useParams } from 'react-router';

const EDITOR_CARD_ACTION = {
	HYDRATE: 'hydrate',
	SET_CARD: 'set-card',
} as const;

const EDITOR_STATUS = {
	DRAFT: 'DRAFT',
	SAVED: 'SAVED',
	SAVING: 'SAVING',
} as const;

type EditorStatus = (typeof EDITOR_STATUS)[keyof typeof EDITOR_STATUS];

type EditorCardAction =
	| { payload: Card; type: typeof EDITOR_CARD_ACTION.HYDRATE }
	| { payload: Card; type: typeof EDITOR_CARD_ACTION.SET_CARD };

function shouldRecordEditorCardAction({ action }: { action: EditorCardAction }): boolean {
	return action.type !== EDITOR_CARD_ACTION.HYDRATE;
}

function editorCardReducer(state: Card, action: EditorCardAction): Card {
	switch (action.type) {
		case EDITOR_CARD_ACTION.HYDRATE:
		case EDITOR_CARD_ACTION.SET_CARD: {
			return action.payload;
		}
		default: {
			return state;
		}
	}
}

interface CardState {
	canRedo: boolean;
	canUndo: boolean;
	card: Card;
	redo: () => void;
	setCard: (card: Card) => void;
	status: EditorStatus;
	undo: () => void;
}

interface EditorProviderProperties {
	children: ReactNode;
}

const EditorContext = createContext<CardState>({} as CardState);

const useEditorContext = (): CardState => useContext(EditorContext);

const EditorProvider: FC<EditorProviderProperties> = ({ children }) => {
	const findCardUseCase = useInjection<FindCardUseCase>(FindCardUseCase);
	const saveCardUseCase = useInjection<SaveCardUseCase>(SaveCardUseCase);
	const { card: cardId } = useParams();
	const initialCard = cardId ? Card.default({ id: cardId }) : Card.default();

	const { data: savedCard } = useQueryUseCase(
		findCardUseCase,
		{ id: cardId },
		{
			retry: 0,
		}
	);

	const { isPending: isSavingCard, mutate: triggerSaveCard } = useMutationUseCase(saveCardUseCase);

	const {
		canRedo,
		canUndo,
		currentEntry,
		dispatch,
		redo,
		state: card,
		undo,
	} = useHistoryReducer<Card, EditorCardAction>(editorCardReducer, initialCard, {
		maxHistory: 100,
		shouldRecord: shouldRecordEditorCardAction,
	});
	const cardReference = useRef(card);
	const currentEntryIdReference = useRef(currentEntry.id);
	const dispatchReference = useRef(dispatch);
	const redoReference = useRef(redo);
	const undoReference = useRef(undo);
	const [lastSavedHistoryEntryId, setLastSavedHistoryEntryId] = useState<string | undefined>();

	useEffect(() => {
		cardReference.current = card;
	}, [card]);

	useEffect(() => {
		currentEntryIdReference.current = currentEntry.id;
	}, [currentEntry.id]);

	useEffect(() => {
		dispatchReference.current = dispatch;
	}, [dispatch]);

	useEffect(() => {
		redoReference.current = redo;
	}, [redo]);

	useEffect(() => {
		undoReference.current = undo;
	}, [undo]);

	useEffect(() => {
		const nextCard = cardId ? Card.default({ id: cardId }) : Card.default();
		dispatchReference.current({ payload: nextCard, type: EDITOR_CARD_ACTION.HYDRATE });
		setLastSavedHistoryEntryId(undefined);
	}, [cardId]);

	useEffect(() => {
		if (!savedCard) {
			return;
		}

		dispatchReference.current({ payload: savedCard, type: EDITOR_CARD_ACTION.HYDRATE });
		setLastSavedHistoryEntryId(currentEntryIdReference.current);
	}, [savedCard]);

	const status: EditorStatus = isSavingCard
		? EDITOR_STATUS.SAVING
		: currentEntry.id === lastSavedHistoryEntryId
			? EDITOR_STATUS.SAVED
			: EDITOR_STATUS.DRAFT;

	function setCard(nextCard: Card): void {
		dispatch({ payload: nextCard, type: EDITOR_CARD_ACTION.SET_CARD });
	}

	useHotkeys(
		'meta+s,ctrl+s',
		event => {
			event.preventDefault();
			const activeEntryId = currentEntryIdReference.current;
			triggerSaveCard(cardReference.current, {
				onSuccess: () => {
					setLastSavedHistoryEntryId(activeEntryId);
				},
			});
		},
		{
			enableOnFormTags: true,
			preventDefault: true,
		},
		[]
	);

	useHotkeys(
		'meta+z,ctrl+z',
		event => {
			event.preventDefault();
			undoReference.current();
		},
		{
			enableOnFormTags: true,
			preventDefault: true,
		},
		[]
	);

	useHotkeys(
		'meta+shift+z,ctrl+shift+z',
		event => {
			event.preventDefault();
			redoReference.current();
		},
		{
			enableOnFormTags: true,
			preventDefault: true,
		},
		[]
	);

	return (
		<EditorContext.Provider value={{ canRedo, canUndo, card, redo, setCard, status, undo }}>
			{children}
		</EditorContext.Provider>
	);
};

export { EditorProvider, useEditorContext };
