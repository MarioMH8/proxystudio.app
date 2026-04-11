/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Maximum number of undo history entries. Defaults to 100. */
	readonly VITE_MAX_UNDO_HISTORY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
