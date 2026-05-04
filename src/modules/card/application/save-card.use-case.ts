import { Card, CardRepository } from '@modules/card/domain';
import { inject, injectable } from 'inversify';

@injectable()
export class SaveCardUseCase {
	constructor(
		@inject(CardRepository)
		private readonly repository: CardRepository
	) {}

	get entityTools(): typeof Card {
		return Card;
	}

	async execute(card: Card): Promise<void> {
		await this.repository.upsert(card);
	}

	generateEntityIdFromParameters({ id }: Card): string {
		return `find-${Card.key}-${id}`;
	}

	optimistically(card: Card): Card {
		return card;
	}
}
