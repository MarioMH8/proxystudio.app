import { FindCardUseCase, SaveCardUseCase } from '@modules/card/application';
import { Card } from '@modules/card/domain';
import { useMutationUseCase, useQueryUseCase } from '@shared/hexagonal';
import { useInjection } from 'inversify-react';
import type { FC, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useParams } from 'react-router';

interface CardState {
	card: Card;
	status: 'DRAFT' | 'SAVED' | 'SAVING';
}

interface EditorProviderProperties {
	children: ReactNode;
}

const EditorContext = createContext<CardState>({} as CardState);

const useEditorContext = (): CardState => useContext(EditorContext);

const EditorProvider: FC<EditorProviderProperties> = ({ children }) => {
	const findCardUseCase = useInjection<FindCardUseCase>(FindCardUseCase);
	const saveCardUseCase = useInjection<FindCardUseCase>(SaveCardUseCase);
	const { card: cardId } = useParams();

	const { data: savedCard } = useQueryUseCase(
		findCardUseCase,
		{ id: cardId },
		{
			retry: 0,
		}
	);

	const { isPending: isSavingCard, mutate: triggerSaveCard } = useMutationUseCase(saveCardUseCase);

	const card = useMemo(
		() => savedCard ?? (cardId ? Card.default({ id: cardId }) : Card.default()),
		[savedCard, cardId]
	);

	const status = useMemo(() => {
		if (savedCard?.id === cardId) {
			return 'SAVED';
		}

		if (isSavingCard) {
			return 'SAVING';
		}

		return 'DRAFT';
	}, [cardId, savedCard, isSavingCard]);

	useHotkeys(
		'meta+s,ctrl+s',
		event => {
			event.preventDefault();
			triggerSaveCard(card);
		},
		{
			enableOnFormTags: true,
			preventDefault: true,
		},
		[]
	);

	return <EditorContext.Provider value={{ card, status }}>{children}</EditorContext.Provider>;
};

export { EditorProvider, useEditorContext };
