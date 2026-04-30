import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface CommandPaletteContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
}

interface CommandPaletteProviderProperties {
	children: ReactNode;
	value: CommandPaletteContextValue;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | undefined>(undefined);

function CommandPaletteProvider({ children, value }: CommandPaletteProviderProperties): ReactNode {
	return <CommandPaletteContext.Provider value={value}>{children}</CommandPaletteContext.Provider>;
}

function useCommandPaletteContext(): CommandPaletteContextValue {
	const context = useContext(CommandPaletteContext);

	if (context === undefined) {
		throw new Error('CommandPalette components must be wrapped in <CommandPalette>.');
	}

	return context;
}

export { CommandPaletteProvider, useCommandPaletteContext };
