import type { DeepPartial } from '@shared/types';

interface CardCriteria {
	limit: number;
	offset: number;
	sort: 'createdAt' | 'name' | 'updatedAt';
	sortDirection: 'asc' | 'desc';
	term?: string;
}

const CardCriteria = {
	default: (partial: DeepPartial<CardCriteria> = {}): CardCriteria => {
		return {
			limit: 10,
			offset: 0,
			sort: 'updatedAt',
			sortDirection: 'desc',
			...partial,
		};
	},
};

export { CardCriteria };
