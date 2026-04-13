/**
 * Command palette sub-feature barrel.
 * Exports the CommandPalette component and useCommands hook for use in the editor.
 */
export type { CommandPaletteProps } from './components/command-palette';
export { default as CommandPalette } from './components/command-palette';
export type { Command, UseCommandsOptions, UseCommandsReturn } from './hooks/use-commands';
export { filterCommands, default as useCommands } from './hooks/use-commands';
