import type { EntityTools } from '@shared/hexagonal/entity-tools';

interface UseCase<Result, Parameters> {
	entityTools?: EntityTools;
	execute: (parameters: Parameters) => Promise<Result>;
	generateEntityIdFromParameters?: (parameters: Parameters) => unknown;
}

type QueryUseCase<Result, Parameters = NonNullable<unknown>> = UseCase<Result, Parameters>;
type MutationUseCase<Result, Parameters = NonNullable<unknown>> = UseCase<Result, Parameters> & {
	optimistically?: (parameters: Parameters) => Result;
};

type UseCaseResultType<UseCase> = UseCase extends QueryUseCase<infer Data, unknown> ? Data : never;
type UseCaseParametersType<UseCase> = UseCase extends QueryUseCase<unknown, infer Parameters> ? Parameters : never;

export type { MutationUseCase, QueryUseCase, UseCase, UseCaseParametersType, UseCaseResultType };
