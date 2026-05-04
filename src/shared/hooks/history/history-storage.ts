interface HistoryEntry<State, Action> {
	action: Action | undefined;
	createdAt: number;
	id: string;
	state: State;
}

interface HistorySnapshot<State, Action> {
	currentIndex: number;
	entries: HistoryEntry<State, Action>[];
}

abstract class HistoryStorage<State, Action> {
	abstract clear(): Promise<void>;
	abstract load(): Promise<HistorySnapshot<State, Action> | undefined>;
	abstract save(snapshot: HistorySnapshot<State, Action>): Promise<void>;
}

export { HistoryStorage };
export type { HistoryEntry, HistorySnapshot };
