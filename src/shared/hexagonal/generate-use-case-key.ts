import type { UseCase } from '@shared/hexagonal/use-case';
import type { QueryKey } from '@tanstack/react-query';

export default function generateUseCaseKey<Result, Parameters>(
	useCase: UseCase<Result, Parameters>,
	parameters: Parameters
): QueryKey | undefined {
	if (!useCase.entityTools?.key) {
		return undefined;
	}

	const key = useCase.entityTools.key;

	if (useCase.generateEntityIdFromParameters) {
		const id = useCase.generateEntityIdFromParameters(parameters);

		// eslint-disable-next-line typescript/no-unsafe-assignment,typescript/no-unsafe-return
		return Array.isArray(id) ? [...id] : [id];
	}

	return [key].filter(Boolean);
}
