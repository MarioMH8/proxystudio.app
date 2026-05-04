import { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import type { HistoryEntry, HistorySnapshot } from './history-storage';
import { HistoryStorage } from './history-storage';
import { InMemoryHistoryStorage } from './in-memory-history-storage';

const HISTORY_OPERATION = {
	CLEAR: 'clear',
	HYDRATE: 'hydrate',
	REDO: 'redo',
	SET_CURRENT_STATE: 'set-current-state',
	TRACK_ACTION: 'track-action',
	UNDO: 'undo',
	VISIT: 'visit',
} as const;

type HistoryOperation = (typeof HISTORY_OPERATION)[keyof typeof HISTORY_OPERATION];

type HistoryState<State, Action> = HistorySnapshot<State, Action>;

interface ShouldRecordContext<State, Action> {
	action: Action;
	nextState: State;
	previousState: State;
}

interface UseHistoryReducerOptions<State, Action> {
	initialEntryId?: string;
	maxHistory?: number;
	shouldRecord?: (context: ShouldRecordContext<State, Action>) => boolean;
	storage?: HistoryStorage<State, Action>;
	trackAction?: boolean;
}

interface UseHistoryReducerResult<State, Action> {
	canRedo: boolean;
	canUndo: boolean;
	clearHistory: () => void;
	currentEntry: HistoryEntry<State, Action>;
	dispatch: (action: Action) => void;
	goTo: (id: string) => void;
	history: HistoryEntry<State, Action>[];
	isHydrated: boolean;
	redo: () => void;
	state: State;
	undo: () => void;
}

interface TrackActionPayload<State, Action> {
	action?: Action;
	nextState: State;
	record: boolean;
	trackAction: boolean;
}

type HistoryReducerAction<State, Action> =
	| { payload: HistorySnapshot<State, Action>; type: typeof HISTORY_OPERATION.HYDRATE }
	| { payload: State; type: typeof HISTORY_OPERATION.SET_CURRENT_STATE }
	| { payload: TrackActionPayload<State, Action>; type: typeof HISTORY_OPERATION.TRACK_ACTION }
	| { payload: { id: string }; type: typeof HISTORY_OPERATION.VISIT }
	| { type: typeof HISTORY_OPERATION.CLEAR }
	| { type: typeof HISTORY_OPERATION.REDO }
	| { type: typeof HISTORY_OPERATION.UNDO };

const DEFAULT_MAX_HISTORY = 100;

function createHistoryEntry<State, Action>(state: State, id?: string, action?: Action): HistoryEntry<State, Action> {
	return {
		action,
		createdAt: Date.now(),
		id: id ?? crypto.randomUUID(),
		state,
	};
}

function clampSnapshot<State, Action>(
	snapshot: HistorySnapshot<State, Action>,
	maxHistory: number
): HistorySnapshot<State, Action> {
	if (snapshot.entries.length <= maxHistory) {
		return snapshot;
	}

	const overflow = snapshot.entries.length - maxHistory;
	const entries = snapshot.entries.slice(overflow);
	const currentIndex = Math.max(0, snapshot.currentIndex - overflow);

	return {
		currentIndex,
		entries,
	};
}

function createInitialHistoryState<State, Action>(
	initialState: State,
	initialEntryId?: string
): HistoryState<State, Action> {
	return {
		currentIndex: 0,
		entries: [createHistoryEntry(initialState, initialEntryId)],
	};
}

function historyReducer<State, Action>(
	state: HistoryState<State, Action>,
	action: HistoryReducerAction<State, Action>,
	maxHistory: number
): HistoryState<State, Action> {
	switch (action.type) {
		case HISTORY_OPERATION.CLEAR: {
			const activeEntry = state.entries[state.currentIndex] ?? state.entries[0];

			if (!activeEntry) {
				return state;
			}

			return {
				currentIndex: 0,
				entries: [createHistoryEntry(activeEntry.state)],
			};
		}

		case HISTORY_OPERATION.HYDRATE: {
			if (action.payload.entries.length === 0) {
				return state;
			}

			return clampSnapshot(action.payload, maxHistory);
		}

		case HISTORY_OPERATION.REDO: {
			if (state.currentIndex >= state.entries.length - 1) {
				return state;
			}

			return {
				...state,
				currentIndex: state.currentIndex + 1,
			};
		}

		case HISTORY_OPERATION.SET_CURRENT_STATE: {
			const entries = state.entries.map((entry, index) =>
				index === state.currentIndex
					? {
							...entry,
							state: action.payload,
						}
					: entry
			);

			return {
				...state,
				entries,
			};
		}

		case HISTORY_OPERATION.TRACK_ACTION: {
			const { nextState, record, trackAction } = action.payload;

			if (!record) {
				return historyReducer(
					state,
					{
						payload: nextState,
						type: HISTORY_OPERATION.SET_CURRENT_STATE,
					},
					maxHistory
				);
			}

			const entries = state.entries.slice(0, state.currentIndex + 1);
			entries.push(createHistoryEntry(nextState, undefined, trackAction ? action.payload.action : undefined));

			return clampSnapshot(
				{
					currentIndex: entries.length - 1,
					entries,
				},
				maxHistory
			);
		}

		case HISTORY_OPERATION.UNDO: {
			if (state.currentIndex === 0) {
				return state;
			}

			return {
				...state,
				currentIndex: state.currentIndex - 1,
			};
		}

		case HISTORY_OPERATION.VISIT: {
			const nextIndex = state.entries.findIndex(entry => entry.id === action.payload.id);

			if (nextIndex === -1) {
				return state;
			}

			return {
				...state,
				currentIndex: nextIndex,
			};
		}

		default: {
			return state;
		}
	}
}

function useHistoryReducer<State, Action>(
	reducer: (state: State, action: Action) => State,
	initialState: State,
	options: UseHistoryReducerOptions<State, Action> = {}
): UseHistoryReducerResult<State, Action> {
	const {
		initialEntryId,
		maxHistory = DEFAULT_MAX_HISTORY,
		shouldRecord = () => true,
		storage,
		trackAction = true,
	} = options;
	const storageReference = useRef<HistoryStorage<State, Action>>(
		storage ?? new InMemoryHistoryStorage<State, Action>()
	);
	const [isHydrated, setIsHydrated] = useState(false);
	const [historyState, historyDispatch] = useReducer(
		(state: HistoryState<State, Action>, action: HistoryReducerAction<State, Action>) =>
			historyReducer(state, action, maxHistory),
		createInitialHistoryState(initialState, initialEntryId)
	);

	useEffect(() => {
		let isMounted = true;

		void storageReference.current.load().then(snapshot => {
			if (!isMounted) {
				return;
			}

			if (snapshot) {
				historyDispatch({ payload: snapshot, type: HISTORY_OPERATION.HYDRATE });
			}

			setIsHydrated(true);
		});

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		if (!isHydrated) {
			return;
		}

		void storageReference.current.save(historyState);
	}, [historyState, isHydrated]);

	const currentEntry =
		historyState.entries[historyState.currentIndex] ??
		historyState.entries[0] ??
		createHistoryEntry(initialState, initialEntryId);

	return useMemo<UseHistoryReducerResult<State, Action>>(
		() => ({
			canRedo: historyState.currentIndex < historyState.entries.length - 1,
			canUndo: historyState.currentIndex > 0,
			clearHistory: () => {
				historyDispatch({ type: HISTORY_OPERATION.CLEAR });
				void storageReference.current.clear();
			},
			currentEntry,
			dispatch: (action: Action) => {
				const previousState = currentEntry.state;
				const nextState = reducer(previousState, action);
				const record = shouldRecord({ action, nextState, previousState });

				historyDispatch({
					payload: {
						action,
						nextState,
						record,
						trackAction,
					},
					type: HISTORY_OPERATION.TRACK_ACTION,
				});
			},
			goTo: (id: string) => {
				historyDispatch({ payload: { id }, type: HISTORY_OPERATION.VISIT });
			},
			history: historyState.entries,
			isHydrated,
			redo: () => {
				historyDispatch({ type: HISTORY_OPERATION.REDO });
			},
			state: currentEntry.state,
			undo: () => {
				historyDispatch({ type: HISTORY_OPERATION.UNDO });
			},
		}),
		[currentEntry, historyState, isHydrated, reducer, shouldRecord, trackAction]
	);
}

export { createInitialHistoryState, HISTORY_OPERATION, historyReducer, useHistoryReducer };

export type {
	HistoryOperation,
	HistoryReducerAction,
	HistoryState,
	ShouldRecordContext,
	TrackActionPayload,
	UseHistoryReducerOptions,
	UseHistoryReducerResult,
};
