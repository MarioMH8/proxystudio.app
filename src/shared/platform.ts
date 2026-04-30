/**
 * Platform detection utilities.
 * Centralises OS sniffing so every consumer uses the same heuristic.
 */

/**
 * Returns `true` when running on macOS.
 *
 * Uses `navigator.userAgentData.platform` (modern, Chromium-based browsers)
 * with a fallback to the legacy `navigator.platform` string.
 * Both are compared case-insensitively against "mac".
 */
function isMac(): boolean {
	// Prefer the modern API when available
	const platform =
		(navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
		navigator.platform;

	return platform.toLowerCase().startsWith('mac');
}

/**
 * Returns the platform-appropriate modifier key label.
 *  - macOS → "⌘" (Command symbol)
 *  - Other → "Ctrl"
 */
const MODIFIER_KIND = {
	SYMBOL: 'symbol',
	TEXT: 'text',
} as const;

type ModifierKind = (typeof MODIFIER_KIND)[keyof typeof MODIFIER_KIND];

interface ModifierKey {
	kind: ModifierKind;
	label: string;
}

function modifierKey(): ModifierKey {
	return isMac()
		? {
				kind: MODIFIER_KIND.SYMBOL,
				label: '⌘',
			}
		: {
				kind: MODIFIER_KIND.TEXT,
				label: 'Ctrl',
			};
}

export { isMac, MODIFIER_KIND, modifierKey };
export type { ModifierKey, ModifierKind };
