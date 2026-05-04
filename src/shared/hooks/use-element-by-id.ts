import { useEffect, useState } from 'react';

function useElementById(id: string): HTMLElement | undefined {
	const [element, setElement] = useState<HTMLElement>();

	useEffect(() => {
		const selector = `#${CSS.escape(id)}`;
		const getElement = (): HTMLElement | undefined => document.querySelector<HTMLElement>(selector) ?? undefined;
		const initialElement = getElement();

		if (initialElement) {
			setElement(initialElement);

			return;
		}

		const observer = new MutationObserver(() => {
			const nextElement = getElement();

			if (nextElement) {
				setElement(nextElement);
				observer.disconnect();
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
		};
	}, [id]);

	return element;
}

export default useElementById;
