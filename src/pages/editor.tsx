import FlexBox from '@components/flex-box';
import SeparatorGrab from '@components/separator-grab';
import { EditorContainer, EditorViewport, LayersPanel } from '@modules/editor/presentation';
import type { ReactNode } from 'react';
import { Group, useDefaultLayout } from 'react-resizable-panels';

const EDITOR_LAYOUT_ID = 'editor-layout';

function Editor(): ReactNode {
	const { defaultLayout, onLayoutChanged } = useDefaultLayout({
		id: EDITOR_LAYOUT_ID,
		storage: localStorage,
	});

	return (
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
	);
}

Editor.displayName = 'EditorPage';

export default Editor;
