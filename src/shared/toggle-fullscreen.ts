export function toggleFullscreen(id: string): void {
	const viewportElement = document.querySelector(`#${id}`);

	if (!viewportElement) {
		return;
	}

	const fullscreenElement = document.fullscreenElement;

	if (fullscreenElement && (fullscreenElement === viewportElement || viewportElement.contains(fullscreenElement))) {
		void document.exitFullscreen();

		return;
	}

	void viewportElement.requestFullscreen();
}
