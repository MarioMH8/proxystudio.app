import { useEffect, useState } from 'react';

type DebouncePredicate<T> = (value: T) => boolean;

const DEFAULT_DEBOUNCE_PREDICATE = (_value: unknown): boolean => true;

function useDebouncedValue<T>(
	value: T,
	delayMs: number,
	shouldDebounce: DebouncePredicate<T> = DEFAULT_DEBOUNCE_PREDICATE
): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		if (!shouldDebounce(value)) {
			setDebouncedValue(value);

			return;
		}

		const timeout = setTimeout(() => {
			setDebouncedValue(value);
		}, delayMs);

		return () => {
			clearTimeout(timeout);
		};
	}, [delayMs, shouldDebounce, value]);

	return debouncedValue;
}

export default useDebouncedValue;
