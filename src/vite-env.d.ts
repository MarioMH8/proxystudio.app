/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Maximum number of undo history entries. Defaults to 100. */
	readonly VITE_MAX_UNDO_HISTORY?: string;
	/** Default zoom percentage on editor load. Defaults to 80. */
	readonly VITE_ZOOM_DEFAULT?: string;
	/** Maximum zoom percentage (inclusive upper bound). Defaults to 400. */
	readonly VITE_ZOOM_MAX?: string;
	/** Minimum zoom percentage (inclusive lower bound). Defaults to 10. */
	readonly VITE_ZOOM_MIN?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
