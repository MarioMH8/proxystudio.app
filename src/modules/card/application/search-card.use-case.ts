import { Card, CardRepository } from '@modules/card/domain';
import type { DeepPartial } from '@shared/types';
import { inject, injectable } from 'inversify';

import { CardCriteria } from '../domain/card.criteria';

type SearchCardUseCaseParameters = DeepPartial<CardCriteria> | undefined;

@injectable()
export class SearchCardUseCase {
	constructor(
		@inject(CardRepository)
		private readonly repository: CardRepository
	) {}

	get entityTools(): typeof Card {
		return Card;
	}

	async execute(criteria: SearchCardUseCaseParameters): Promise<Card[]> {
		const cards = await this.repository.search(CardCriteria.default(criteria));

		return cards.map(card => Card.default(card));
	}

	generateEntityIdFromParameters(criteria: SearchCardUseCaseParameters): string {
		const fullCriteria = CardCriteria.default(criteria);

		return `search-${Card.key}-limit-${fullCriteria.limit.toFixed(0)}-offset-${fullCriteria.offset.toFixed(0)}`;
	}
}
