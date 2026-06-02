import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

import { CommandPaletteProvider } from './command-palette-context';

interface CommandPaletteProperties {
	children: ReactNode;
	defaultOpen?: boolean;
	onOpenChange?: ((open: boolean) => void) | undefined;
	open?: boolean | undefined;
}

function CommandPalette({ children, defaultOpen = false, onOpenChange, open }: CommandPaletteProperties): ReactNode {
	const defaultOpenReference = useRef(defaultOpen);
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpenReference.current);
	const isControlled = open !== undefined;
	const currentOpen = isControlled ? open : uncontrolledOpen;

	function setOpen(nextOpen: boolean): void {
		if (!isControlled) {
			setUncontrolledOpen(nextOpen);
		}

		onOpenChange?.(nextOpen);
	}

	return <CommandPaletteProvider value={{ open: currentOpen, setOpen }}>{children}</CommandPaletteProvider>;
}

CommandPalette.displayName = 'CommandPalette';

export type { CommandPaletteProperties };
export default CommandPalette;
