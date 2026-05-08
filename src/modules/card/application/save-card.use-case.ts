import { Card, CardRepository } from '@modules/card/domain';
import { inject, injectable } from 'inversify';

@injectable()
export class SaveCardUseCase {
	constructor(
		@inject(CardRepository)
		private readonly repository: CardRepository
	) {}

	async execute(card: Card): Promise<void> {
		await this.repository.upsert(card);
	}
}
