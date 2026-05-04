import { describe, expect, it } from 'bun:test';

import { InMemoryHistoryStorage } from './in-memory-history-storage';
import type { HistoryReducerAction, HistoryState } from './use-history-reducer';
import { createInitialHistoryState, historyReducer } from './use-history-reducer';

const COUNTER_ACTION = {
	DECREMENT: 'decrement',
	INCREMENT: 'increment',
	SET: 'set',
	TRANSIENT: 'transient',
} as const;

type CounterAction =
	| { payload: number; type: typeof COUNTER_ACTION.SET }
	| { type: typeof COUNTER_ACTION.DECREMENT }
	| { type: typeof COUNTER_ACTION.INCREMENT }
	| { type: typeof COUNTER_ACTION.TRANSIENT };

function reduceHistory(
	state: HistoryState<number, CounterAction>,
	action: HistoryReducerAction<number, CounterAction>,
	maxHistory = 100
): HistoryState<number, CounterAction> {
	return historyReducer(state, action, maxHistory);
}

describe('historyReducer', () => {
	it('should create a new history entry for tracked actions', () => {
		const initialState = createInitialHistoryState<number, CounterAction>(0, 'initial');
		const nextState = reduceHistory(initialState, {
			payload: {
				action: { type: COUNTER_ACTION.INCREMENT },
				nextState: 1,
				record: true,
				trackAction: true,
			},
			type: 'track-action',
		});

		expect(nextState.currentIndex).toBe(1);
		expect(nextState.entries).toHaveLength(2);
		expect(nextState.entries[1]?.state).toBe(1);
		expect(nextState.entries[1]?.action).toEqual({ type: COUNTER_ACTION.INCREMENT });
	});

	it('should update current state without recording excluded actions', () => {
		const initialState = createInitialHistoryState<number, CounterAction>(0, 'initial');
		const nextState = reduceHistory(initialState, {
			payload: {
				action: { type: COUNTER_ACTION.TRANSIENT },
				nextState: 3,
				record: false,
				trackAction: true,
			},
			type: 'track-action',
		});

		expect(nextState.currentIndex).toBe(0);
		expect(nextState.entries).toHaveLength(1);
		expect(nextState.entries[0]?.state).toBe(3);
	});

	it('should clear future entries when creating a new branch', () => {
		const initialState = createInitialHistoryState<number, CounterAction>(0, 'initial');
		const withFirstEntry = reduceHistory(initialState, {
			payload: {
				action: { type: COUNTER_ACTION.INCREMENT },
				nextState: 1,
				record: true,
				trackAction: true,
			},
			type: 'track-action',
		});
		const withSecondEntry = reduceHistory(withFirstEntry, {
			payload: {
				action: { type: COUNTER_ACTION.INCREMENT },
				nextState: 2,
				record: true,
				trackAction: true,
			},
			type: 'track-action',
		});
		const undone = reduceHistory(withSecondEntry, { type: 'undo' });
		const branched = reduceHistory(undone, {
			payload: {
				action: { payload: 42, type: COUNTER_ACTION.SET },
				nextState: 42,
				record: true,
				trackAction: true,
			},
			type: 'track-action',
		});

		expect(branched.currentIndex).toBe(2);
		expect(branched.entries).toHaveLength(3);
		expect(branched.entries.at(-1)?.state).toBe(42);
	});

	it('should visit a specific history entry by id', () => {
		const initialState = createInitialHistoryState<number, CounterAction>(0, 'initial');
		const withEntry = reduceHistory(initialState, {
			payload: {
				action: { type: COUNTER_ACTION.INCREMENT },
				nextState: 1,
				record: true,
				trackAction: true,
			},
			type: 'track-action',
		});
		const firstId = withEntry.entries[0]?.id;

		if (!firstId) {
			throw new Error('firstId should exist');
		}

		const visited = reduceHistory(withEntry, { payload: { id: firstId }, type: 'visit' });

		expect(visited.currentIndex).toBe(0);
		expect(visited.entries[visited.currentIndex]?.state).toBe(0);
	});

	it('should enforce the maximum history size', () => {
		let state = createInitialHistoryState<number, CounterAction>(0, 'initial');

		for (const value of [1, 2, 3]) {
			state = reduceHistory(
				state,
				{
					payload: {
						action: { payload: value, type: COUNTER_ACTION.SET },
						nextState: value,
						record: true,
						trackAction: true,
					},
					type: 'track-action',
				},
				2
			);
		}

		expect(state.entries).toHaveLength(2);
		expect(state.currentIndex).toBe(1);
		expect(state.entries[0]?.state).toBe(2);
		expect(state.entries[1]?.state).toBe(3);
	});
});

describe('InMemoryHistoryStorage', () => {
	it('should save, load and clear snapshots', async () => {
		const storage = new InMemoryHistoryStorage<number, CounterAction>();
		const snapshot = createInitialHistoryState<number, CounterAction>(7, 'snapshot');

		await storage.save(snapshot);
		expect(await storage.load()).toEqual(snapshot);

		await storage.clear();
		expect(await storage.load()).toBeUndefined();
	});
});
