import { openDB } from 'idb';

const VERSION = 1;
const NAME = 'proxystudio.app';

const database = await openDB(NAME, VERSION, {
	upgrade(database) {
		database.createObjectStore('settings', {
			autoIncrement: true,
			keyPath: 'id',
		});
		const cardStore = database.createObjectStore('card', {
			autoIncrement: true,
			keyPath: 'id',
		});
		cardStore.createIndex('metadata.createdAt', 'metadata.createdAt');
		cardStore.createIndex('metadata.updatedAt', 'metadata.updatedAt');
		cardStore.createIndex('metadata.name', 'metadata.name');
	},
});

export default database;
