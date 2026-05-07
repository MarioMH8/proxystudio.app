import FlexBox from '@components/flex-box';
import SeparatorGrab from '@components/separator-grab';
import { CardHeader, EditorContainer, EditorViewport, LayersPanel } from '@modules/editor/presentation';
import { EditorProvider } from '@modules/editor/store';
import useElementById from '@shared/hooks/use-element-by-id';
import { Portal } from 'radix-ui';
import type { ReactNode } from 'react';
import { Group, useDefaultLayout } from 'react-resizable-panels';

const EDITOR_LAYOUT_ID = 'editor';

function EditorPage(): ReactNode {
	const { defaultLayout, onLayoutChanged } = useDefaultLayout({
		id: EDITOR_LAYOUT_ID,
		storage: localStorage,
	});
	const leftMenuPortalContainer = useElementById('menu-left-portal');

	return (
		<EditorProvider>
			<FlexBox
				asChild
				items='stretch'
				justify='between'>
				<EditorContainer asChild>
					<Group
						defaultLayout={defaultLayout}
						onLayoutChanged={onLayoutChanged}>
						<LayersPanel className='z-10' />
						<SeparatorGrab orientation='horizontal' />
						<EditorViewport />
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
		</EditorProvider>
	);
}

EditorPage.displayName = 'EditorPage';

export default EditorPage;
