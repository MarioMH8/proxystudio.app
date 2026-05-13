import FlexBox from '@components/flex-box';
import SeparatorGrab from '@components/separator-grab';
import { CardRenderer } from '@modules/card/presentation';
import { editorSlice, selectCard, useFindCardQuery } from '@modules/editor/store';
import useElementById from '@shared/hooks/use-element-by-id';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { Portal } from 'radix-ui';
import type { ReactNode } from 'react';
import { Fragment, useEffect } from 'react';
import { Group, useDefaultLayout } from 'react-resizable-panels';
import { useNavigate, useParams } from 'react-router';

import CardHeader from './card-header';
import EditorContainer from './container';
import LayersPanel from './layers-panel';
import NewCardButton from './new-card-button';
import useEditorBeforeUnload from './use-editor-before-unload';
import useEditorHotkeys from './use-editor-hotkeys';
import { EDITOR_ID } from './viewport/const';
import EditorViewport from './viewport/viewport';

const EDITOR_LAYOUT_ID = 'editor';

function EditorPage(): ReactNode {
	const { defaultLayout, onLayoutChanged } = useDefaultLayout({
		id: EDITOR_LAYOUT_ID,
		storage: localStorage,
	});
	const leftMenuPortalContainer = useElementById('menu-left-portal');
	const rightMenuPortalContainer = useElementById('menu-right-portal');
	const { card: cardId } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const card = useAppSelector(selectCard);

	function handleCreateNewCard(): void {
		const action = editorSlice.actions.createCard();
		dispatch(action);
		void navigate(`/${action.payload}/editor`);
	}

	useEditorHotkeys();
	useEditorBeforeUnload();

	useFindCardQuery(
		{ id: cardId },
		{
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		dispatch(editorSlice.actions.resetCard(cardId));
	}, [cardId, dispatch]);

	return (
		<Fragment>
			<FlexBox
				asChild
				items='stretch'
				justify='between'>
				<EditorContainer asChild>
					<Group
						defaultLayout={defaultLayout}
						id={EDITOR_ID}
						onLayoutChanged={onLayoutChanged}>
						<LayersPanel className='z-10' />
						<SeparatorGrab orientation='horizontal' />
						<EditorViewport>
							<CardRenderer card={card} />
						</EditorViewport>
					</Group>
				</EditorContainer>
			</FlexBox>
			{leftMenuPortalContainer ? (
				<Portal.Portal
					asChild
					container={leftMenuPortalContainer}>
					<CardHeader />
				</Portal.Portal>
			) : undefined}
			{rightMenuPortalContainer ? (
				<Portal.Portal
					asChild
					container={rightMenuPortalContainer}>
					<NewCardButton onCreateNewCard={handleCreateNewCard} />
				</Portal.Portal>
			) : undefined}
		</Fragment>
	);
}

EditorPage.displayName = 'EditorPage';

export default EditorPage;
