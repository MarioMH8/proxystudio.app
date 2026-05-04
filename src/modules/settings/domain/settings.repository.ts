import type { DeepPartial } from '@shared/types';

import type { Settings } from './settings';

export abstract class SettingsRepository {
	abstract find(): DeepPartial<Settings | undefined> | Promise<DeepPartial<Settings | undefined>>;
	abstract upsert(settings: Settings): Promise<void> | void;
}
