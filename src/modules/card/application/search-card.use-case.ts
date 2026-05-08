import { Card, CardCriteria, CardRepository } from '@modules/card/domain';
import type { DeepPartial } from '@shared/types';
import { inject, injectable } from 'inversify';

type SearchCardUseCaseParameters = DeepPartial<CardCriteria> | undefined;

@injectable()
export class SearchCardUseCase {
	constructor(
		@inject(CardRepository)
		private readonly repository: CardRepository
	) {}

	async execute(criteria: SearchCardUseCaseParameters): Promise<Card[]> {
		const cards = await this.repository.search(CardCriteria.default(criteria));

		return cards.map(card => Card.default(card));
	}
}
