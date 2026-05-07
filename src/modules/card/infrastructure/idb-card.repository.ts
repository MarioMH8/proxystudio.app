import type { CardCriteria } from '@modules/card/domain';
import { Card, CardRepository } from '@modules/card/domain';
import type { DeepPartial } from '@shared/types';
import type { DBSchema, IDBPDatabase } from 'idb';
import { inject, injectable } from 'inversify';

const STORE_NAME = 'card';

interface CardDatabaseSchema extends DBSchema {
	[STORE_NAME]: {
		indexes: { 'metadata.createdAt': Date; 'metadata.name': string; 'metadata.updatedAt': Date };
		key: string;
		value: Card;
	};
}

@injectable()
export class IndexedDBDatabaseCardRepository extends CardRepository {
	constructor(
		@inject('INDEXED_DB')
		private readonly database: IDBPDatabase<CardDatabaseSchema>
	) {
		super();
	}

	override async find(id: string): Promise<DeepPartial<Card | undefined>> {
		return await this.database.get('card', id);
	}

	override async search(criteria: CardCriteria): Promise<DeepPartial<Card>[]> {
		const term = criteria.term?.trim().toLocaleLowerCase();
		const tx = this.database.transaction(STORE_NAME, 'readonly');
		const indexName = `metadata.${criteria.sort}` as const;
		const index = tx.store.index(indexName);
		const cards = await index.getAll();
		const orderedCards = criteria.sortDirection === 'asc' ? cards : cards.toReversed();
		const matchingCards = term?.length
			? orderedCards.filter(({ name }) => typeof name === 'string' && name.toLocaleLowerCase().includes(term))
			: orderedCards;

		await tx.done;

		return matchingCards.slice(criteria.offset, criteria.offset + criteria.limit);
	}

	override async upsert(card: Card): Promise<void> {
		await this.database.add('card', card);
	}
}
