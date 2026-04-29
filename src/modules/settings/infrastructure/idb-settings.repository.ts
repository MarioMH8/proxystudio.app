import { Settings, SettingsRepository } from '@modules/settings/domain';
import type { DBSchema, IDBPDatabase } from 'idb';
import { inject, injectable } from 'inversify';

const STORE_NAME = 'settings';

interface SettingsDatabaseSchema extends DBSchema {
	[STORE_NAME]: {
		key: number;
		value: Settings;
	};
}

@injectable()
export class IndexedDBDatabaseSettingsRepository extends SettingsRepository {
	constructor(
		@inject('INDEXED_DB')
		private readonly database: IDBPDatabase<SettingsDatabaseSchema>
	) {
		super();
	}

	override async find(): Promise<Partial<Settings | undefined>> {
		const settings = await this.database.getAll(STORE_NAME, undefined, 1);

		return settings.at(0);
	}

	override async upsert(settings: Settings): Promise<void> {
		const tx = this.database.transaction(STORE_NAME, 'readwrite');
		await tx.store.clear();
		await tx.store.add(settings);
		await tx.done;
	}
}
