import FlexBox from '@components/flex-box';
import SeparatorGrab from '@components/separator-grab';
import type { CardRendererReference } from '@modules/card/presentation';
import { CardRenderer } from '@modules/card/presentation';
import { editorSlice, selectCard, useFindCardQuery } from '@modules/editor/store';
import useElementById from '@shared/hooks/use-element-by-id';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { Portal } from 'radix-ui';
import type { ReactNode } from 'react';
import { Fragment, useEffect, useRef } from 'react';
import { Group, useDefaultLayout } from 'react-resizable-panels';
import { useNavigate, useParams } from 'react-router';

import CardHeader from './card/card-header';
import DownloadCardButton from './card/download-card-button';
import NewCardButton from './card/new-card-button';
import EditorContainer from './editor/editor-container';
import useEditorBeforeUnload from './editor/use-editor-before-unload';
import useEditorHotkeys from './editor/use-editor-hotkeys';
import LayerPanel from './layer/layer-panel';
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
	const cardRendererReference = useRef<CardRendererReference>(null);

	function handleCreateNewCard(): void {
		const action = editorSlice.actions.createCard();
		dispatch(action);
		void navigate(`/${action.payload}/editor`);
	}

	function handleDownloadCard(): void {
		const imageDataUrl = cardRendererReference.current?.exportImage();

		if (!imageDataUrl) {
			return;
		}

		const downloadAnchor = document.createElement('a');
		downloadAnchor.download = `${card.name}.png`;
		downloadAnchor.href = imageDataUrl;
		downloadAnchor.click();
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
						<LayerPanel className='z-10' />
						<SeparatorGrab orientation='horizontal' />
						<EditorViewport>
							<CardRenderer
								card={card}
								ref={cardRendererReference}
							/>
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
					<Fragment>
						<DownloadCardButton onDownloadCard={handleDownloadCard} />
						<NewCardButton onCreateNewCard={handleCreateNewCard} />
					</Fragment>
				</Portal.Portal>
			) : undefined}
		</Fragment>
	);
}

EditorPage.displayName = 'EditorPage';

export default EditorPage;
