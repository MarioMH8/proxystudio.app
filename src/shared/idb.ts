import { openDB } from 'idb';

const VERSION = 1;
const NAME = 'proxystudio.app';

const database = await openDB(NAME, VERSION, {
	upgrade(database) {
		// Create a store of objects
		database.createObjectStore('settings', {
			// If it isn't explicitly set, create a value by auto incrementing.
			autoIncrement: true,
			// The 'id' property of the object will be the key.
			keyPath: 'id',
		});
	},
});

export default database;
