import type { HistorySnapshot } from './history-storage';
import { HistoryStorage } from './history-storage';

class InMemoryHistoryStorage<State, Action> extends HistoryStorage<State, Action> {
	private snapshot: HistorySnapshot<State, Action> | undefined;

	override async clear(): Promise<void> {
		this.snapshot = undefined;
		await Promise.resolve();
	}

	override async load(): Promise<HistorySnapshot<State, Action> | undefined> {
		await Promise.resolve();

		return this.snapshot;
	}

	override async save(snapshot: HistorySnapshot<State, Action>): Promise<void> {
		this.snapshot = snapshot;
		await Promise.resolve();
	}
}

export { InMemoryHistoryStorage };
