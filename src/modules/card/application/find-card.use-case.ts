import { Card, CardRepository } from '@modules/card/domain';
import { inject, injectable } from 'inversify';

interface FindCardUseCaseParameters {
	id: string;
}

class FindCardUseCaseError extends Error {}

@injectable()
export class FindCardUseCase {
	constructor(
		@inject(CardRepository)
		private readonly repository: CardRepository
	) {}

	async execute({ id }: FindCardUseCaseParameters): Promise<Card | undefined> {
		const partial = await this.repository.find(id);
		if (!partial) {
			throw new FindCardUseCaseError(`Unable to find card with id ${id}`);
		}

		return Card.default(partial);
	}
}
