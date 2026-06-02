import type { DeepPartial } from '@shared/types';

import type { Card } from './card';
import type { CardCriteria } from './card.criteria';

export abstract class CardRepository {
	abstract find(id: string): DeepPartial<Card | undefined> | Promise<DeepPartial<Card | undefined>>;
	abstract search(criteria: CardCriteria): DeepPartial<Card>[] | Promise<DeepPartial<Card>[]>;
	abstract upsert(card: Card): Promise<void> | void;
}
