import type { Settings } from './settings';

export abstract class SettingsRepository {
	abstract find(): Partial<Settings | undefined> | Promise<Partial<Settings | undefined>>;
	abstract upsert(settings: Settings): Promise<void> | void;
}
