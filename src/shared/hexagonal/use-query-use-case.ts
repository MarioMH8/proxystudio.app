import generateUseCaseKey from '@shared/hexagonal/generate-use-case-key';
import type { QueryUseCase } from '@shared/hexagonal/use-case';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

type QueryUseCaseOptions<Result> = Omit<UseQueryOptions<Result, Error, Result>, 'queryFn' | 'queryKey'>;

export default function useQueryUseCase<Result>(
	useCase: QueryUseCase<Result, undefined>,
	options?: QueryUseCaseOptions<Result>
): UseQueryResult<Result>;

export default function useQueryUseCase<Result, Parameters>(
	useCase: QueryUseCase<Result, Parameters>,
	parameters: Parameters,
	options?: QueryUseCaseOptions<Result>
): UseQueryResult<Result>;

export default function useQueryUseCase<Result, Parameters>(
	useCase: QueryUseCase<Result, Parameters>,
	parametersOrOptions?: Parameters | QueryUseCaseOptions<Result>,
	maybeOptions?: QueryUseCaseOptions<Result>
): UseQueryResult<Result> {
	const isParameterlessUseCase = useCase.execute.length === 0;
	const options = (isParameterlessUseCase ? parametersOrOptions : maybeOptions) as
		| QueryUseCaseOptions<Result>
		| undefined;
	const parameters = (isParameterlessUseCase ? undefined : parametersOrOptions) as Parameters | undefined;

	const key = generateUseCaseKey(useCase, parameters as Parameters);

	return useQuery<Result, Error, Result>({
		...options,
		queryKey: key ?? [],
		...(!key && useCase.entityTools?.ttl !== undefined && { gcTime: useCase.entityTools.ttl }),
		queryFn: () => useCase.execute(parameters as Parameters),
	});
}
