import FlexBox from '@components/flex-box';
import SeparatorGrab from '@components/separator-grab';
import { CardRenderer } from '@modules/card/presentation';
import {
	CardHeader,
	EDITOR_ID,
	EditorContainer,
	EditorViewport,
	LayersPanel,
	useEditorBeforeUnload,
	useEditorHotkeys,
} from '@modules/editor/presentation';
import { editorSlice, selectCard, useFindCardQuery } from '@modules/editor/store';
import useElementById from '@shared/hooks/use-element-by-id';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { Portal } from 'radix-ui';
import type { ReactNode } from 'react';
import { Fragment, useEffect } from 'react';
import { Group, useDefaultLayout } from 'react-resizable-panels';
import { useParams } from 'react-router';

const EDITOR_LAYOUT_ID = 'editor';

function EditorPage(): ReactNode {
	const { defaultLayout, onLayoutChanged } = useDefaultLayout({
		id: EDITOR_LAYOUT_ID,
		storage: localStorage,
	});
	const leftMenuPortalContainer = useElementById('menu-left-portal');
	const { card: cardId } = useParams();
	const dispatch = useAppDispatch();
	const card = useAppSelector(selectCard);

	useEditorHotkeys();
	useEditorBeforeUnload();

	useFindCardQuery(
		{ id: cardId },
		{
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		dispatch(editorSlice.actions.cardReset(cardId));
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
		</Fragment>
	);
}

EditorPage.displayName = 'EditorPage';

export default EditorPage;
