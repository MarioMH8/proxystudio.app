import { Card, CardCriteria, CardRepository } from '@modules/card/domain';
import { inject, injectable } from 'inversify';

class FindLastCardUseCaseError extends Error {}

@injectable()
export class FindLastCardUseCase {
	constructor(
		@inject(CardRepository)
		private readonly repository: CardRepository
	) {}

	async execute(): Promise<Card | undefined> {
		const partial = await this.repository.search(
			CardCriteria.default({
				limit: 1,
				offset: 0,
				sort: 'updatedAt',
				sortDirection: 'desc',
			})
		);
		const last = partial.at(0);

		if (!last) {
			throw new FindLastCardUseCaseError(`Unable to find card any card`);
		}

		return Card.default(last);
	}
}
