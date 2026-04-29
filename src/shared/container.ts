import { FindSettingsUseCase, SaveSettingsUseCase } from '@modules/settings/application';
import { SettingsRepository } from '@modules/settings/domain';
import { IndexedDBDatabaseSettingsRepository } from '@modules/settings/infrastructure';
import database from '@shared/idb';
import { Container } from 'inversify';

const container = new Container();

container.bind(FindSettingsUseCase).toSelf();
container.bind(SaveSettingsUseCase).toSelf();
container.bind(SettingsRepository).to(IndexedDBDatabaseSettingsRepository);
container.bind('INDEXED_DB').toConstantValue(database);

export default container;
