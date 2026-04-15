import type { ReactNode } from 'react';

import { selectIsSelectedLayerLocked, selectSelectedLayer, useEditorSelector } from '../../store';
import FrameProperties from './frame-properties';
import PropertiesSection from './properties-section';

/**
 * Contextual properties panel.
 *
 * Reads the currently selected layer from the editor store and renders
 * type-specific controls. Returns null when no layer is selected or when
 * the selected layer type has no editable properties in this version.
 *
 * Supported types:
 *   - frame → FrameProperties (opacity slider)
 */
function PropertiesPanel(): ReactNode {
	const selectedLayer = useEditorSelector(selectSelectedLayer);
	const isSelectedLayerLocked = useEditorSelector(selectIsSelectedLayerLocked);

	if (!selectedLayer) {
		return undefined;
	}

	if (selectedLayer.type === 'frame') {
		return (
			<PropertiesSection>
				<FrameProperties
					isLocked={isSelectedLayerLocked}
					layer={selectedLayer}
				/>
			</PropertiesSection>
		);
	}

	return undefined;
}

PropertiesPanel.displayName = 'PropertiesPanel';

export default PropertiesPanel;
