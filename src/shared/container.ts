import { FindCardUseCase, FindLastCardUseCase, SaveCardUseCase, SearchCardUseCase } from '@modules/card/application';
import { CardRepository } from '@modules/card/domain';
import { IndexedDBDatabaseCardRepository } from '@modules/card/infrastructure';
import { FindSettingsUseCase, SaveSettingsUseCase } from '@modules/settings/application';
import { SettingsRepository } from '@modules/settings/domain';
import { IndexedDBDatabaseSettingsRepository } from '@modules/settings/infrastructure';
import database from '@shared/idb';
import { Container } from 'inversify';

const container = new Container();

container.bind(FindLastCardUseCase).toSelf();
container.bind(FindCardUseCase).toSelf();
container.bind(SaveCardUseCase).toSelf();
container.bind(SearchCardUseCase).toSelf();
container.bind(FindSettingsUseCase).toSelf();
container.bind(SaveSettingsUseCase).toSelf();
container.bind(SettingsRepository).to(IndexedDBDatabaseSettingsRepository);
container.bind(CardRepository).to(IndexedDBDatabaseCardRepository);
container.bind('INDEXED_DB').toConstantValue(database);

export default container;
