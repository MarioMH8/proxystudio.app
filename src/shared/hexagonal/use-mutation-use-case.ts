import generateUseCaseKey from '@shared/hexagonal/generate-use-case-key';
import type { MutationUseCase } from '@shared/hexagonal/use-case';
import type { MutationObserverOptions, QueryKey, UseMutationResult } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface MutationContext<Value> {
	key: QueryKey | undefined;
	previousValue: undefined | Value;
}

export default function useMutationUseCase<Result, Parameters>(
	useCase: MutationUseCase<Result, Parameters>,
	options?: MutationObserverOptions<Result, Error, Parameters>
): UseMutationResult<Result, Error, Parameters, MutationContext<Result>> {
	const client = useQueryClient();

	return useMutation<Result, Error, Parameters, MutationContext<Result>>({
		...options,
		...(useCase.entityTools?.ttl !== undefined && { gcTime: useCase.entityTools.ttl }),
		mutationFn: (parameters: Parameters) => useCase.execute(parameters),
		onError: (error, parameters, onMutateResult, context) => {
			if (onMutateResult?.key) {
				client.setQueryData(onMutateResult.key, onMutateResult.previousValue);
			}
			options?.onError?.(error, parameters, onMutateResult, context);
		},
		onMutate: async (parameters: Parameters, context) => {
			const key = generateUseCaseKey<Result, Parameters>(useCase, parameters);

			if (!key) {
				await options?.onMutate?.(parameters, context);

				return {
					key: undefined,
					previousValue: undefined,
				};
			}

			await client.cancelQueries({ queryKey: key });

			const previousValue = client.getQueryData<Result>(key);

			if (useCase.optimistically) {
				const optimistic = await useCase.optimistically(parameters);
				client.setQueryData(key, optimistic);
			}

			await options?.onMutate?.(parameters, context);

			return {
				key,
				previousValue,
			};
		},
		onSettled: (result, error, parameters, onMutateResult, context) => {
			options?.onSettled?.(result, error, parameters, onMutateResult, context);
		},
		onSuccess: (result, parameters, onMutateResult, context) => {
			if (onMutateResult.key) {
				client.setQueryData(onMutateResult.key, result);
			}
			options?.onSuccess?.(result, parameters, onMutateResult, context);
		},
	});
}
