import type { Container } from 'inversify';

let container: Container | undefined;

function setContainer(value: Container): void {
	container = value;
}

function getContainer(): Container {
	if (!container) {
		throw new Error('Inversify container has not been set. Call setContainer() before using the store.');
	}

	return container;
}

export { getContainer, setContainer };
