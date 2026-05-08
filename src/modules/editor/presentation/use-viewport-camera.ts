import {
	EDITOR_TOOL,
	editorSlice,
	selectCard,
	selectViewportHasInteracted,
	selectViewportOffset,
	selectViewportTool,
	selectViewportZoom,
} from '@modules/editor/store';
import useContainerSize from '@shared/hooks/use-container-size';
import { useAppDispatch, useAppSelector } from '@shared/store';
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

const VIEWPORT_PADDING = 64;
const VIEWPORT_WHEEL_ZOOM_FACTOR = 0.001;

function calculateFitZoom(
	cardHeight: number,
	cardWidth: number,
	viewportHeight: number,
	viewportWidth: number
): number {
	if (cardHeight <= 0 || cardWidth <= 0 || viewportHeight <= 0 || viewportWidth <= 0) {
		return 1;
	}

	return Math.max(
		Math.min(
			(viewportWidth - VIEWPORT_PADDING * 2) / cardWidth,
			(viewportHeight - VIEWPORT_PADDING * 2) / cardHeight
		),
		0.1
	);
}

interface UseViewportCameraResult {
	containerRef: ReturnType<typeof useContainerSize>['containerRef'];
	handlePointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
	handlePointerEnd: (event: ReactPointerEvent<HTMLDivElement>) => void;
	handlePointerLeave: (event: ReactPointerEvent<HTMLDivElement>) => void;
	handlePointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
	handleWheel: (event: ReactWheelEvent<HTMLDivElement>) => void;
	isDragging: boolean;
	offsetX: string;
	offsetY: string;
	tool: (typeof EDITOR_TOOL)[keyof typeof EDITOR_TOOL];
	zoom: string;
}

interface ViewportPoint {
	x: number;
	y: number;
}

function calculateCursorOffset(
	cursorPoint: ViewportPoint,
	offsetPoint: ViewportPoint,
	viewportPoint: ViewportPoint,
	zoom: number
): ViewportPoint {
	return {
		x: (cursorPoint.x - viewportPoint.x - offsetPoint.x) / zoom,
		y: (cursorPoint.y - viewportPoint.y - offsetPoint.y) / zoom,
	};
}

function calculateZoomOffset(
	cursorPoint: ViewportPoint,
	scenePoint: ViewportPoint,
	viewportPoint: ViewportPoint,
	zoom: number
): ViewportPoint {
	return {
		x: cursorPoint.x - viewportPoint.x - scenePoint.x * zoom,
		y: cursorPoint.y - viewportPoint.y - scenePoint.y * zoom,
	};
}

function useViewportCamera(): UseViewportCameraResult {
	const dispatch = useAppDispatch();
	const card = useAppSelector(selectCard);
	const hasInteracted = useAppSelector(selectViewportHasInteracted);
	const offset = useAppSelector(selectViewportOffset);
	const tool = useAppSelector(selectViewportTool);
	const zoom = useAppSelector(selectViewportZoom);
	const { containerRef, size } = useContainerSize();
	const pointerPositionReference = useRef({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		if (hasInteracted || size.height <= 0 || size.width <= 0) {
			return;
		}

		dispatch(
			editorSlice.actions.viewportReset({
				markAsInteracted: false,
				zoom: calculateFitZoom(card.dimensions.height, card.dimensions.width, size.height, size.width),
			})
		);
	}, [card.dimensions.height, card.dimensions.width, dispatch, hasInteracted, size.height, size.width]);

	function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>): void {
		if (tool !== EDITOR_TOOL.PAN) {
			return;
		}

		event.preventDefault();
		pointerPositionReference.current = { x: event.clientX, y: event.clientY };
		event.currentTarget.setPointerCapture(event.pointerId);
		setIsDragging(true);
	}

	function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>): void {
		if (!isDragging) {
			return;
		}

		const deltaX = event.clientX - pointerPositionReference.current.x;
		const deltaY = event.clientY - pointerPositionReference.current.y;

		pointerPositionReference.current = { x: event.clientX, y: event.clientY };
		dispatch(editorSlice.actions.viewportPanBy({ x: deltaX, y: deltaY }));
	}

	function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>): void {
		if (!isDragging) {
			return;
		}

		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}

		setIsDragging(false);
	}

	function handlePointerLeave(event: ReactPointerEvent<HTMLDivElement>): void {
		if (!isDragging) {
			return;
		}

		handlePointerEnd(event);
	}

	function handleWheel(event: ReactWheelEvent<HTMLDivElement>): void {
		if (!event.ctrlKey && !event.metaKey) {
			return;
		}

		event.preventDefault();

		const container = containerRef.current;

		if (!container) {
			dispatch(editorSlice.actions.viewportZoomSet(zoom - event.deltaY * VIEWPORT_WHEEL_ZOOM_FACTOR));

			return;
		}

		const viewportRectangle = container.getBoundingClientRect();
		const viewportCenter = {
			x: viewportRectangle.width / 2,
			y: viewportRectangle.height / 2,
		};
		const cursorPoint = {
			x: event.clientX - viewportRectangle.left,
			y: event.clientY - viewportRectangle.top,
		};
		const currentOffset = { x: offset.x, y: offset.y };
		const nextZoom = Math.min(Math.max(zoom - event.deltaY * VIEWPORT_WHEEL_ZOOM_FACTOR, 0.1), 4);

		if (nextZoom === zoom) {
			return;
		}

		const scenePoint = calculateCursorOffset(cursorPoint, currentOffset, viewportCenter, zoom);
		const nextOffset = calculateZoomOffset(cursorPoint, scenePoint, viewportCenter, nextZoom);

		dispatch(editorSlice.actions.viewportPanSet(nextOffset));
		dispatch(editorSlice.actions.viewportZoomSet(nextZoom));
	}

	return {
		containerRef,
		handlePointerDown,
		handlePointerEnd,
		handlePointerLeave,
		handlePointerMove,
		handleWheel,
		isDragging,
		offsetX: offset.x.toFixed(3),
		offsetY: offset.y.toFixed(3),
		tool,
		zoom: zoom.toFixed(3),
	};
}

export default useViewportCamera;
