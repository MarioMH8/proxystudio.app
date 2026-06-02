type PropertiesWithAsChild<Properties> = Properties & {
	asChild?: boolean;
};

type Primitive = bigint | boolean | null | number | string | symbol | undefined;
type AnyFunction = (...arguments_: never[]) => unknown;
type BuiltIn = AnyFunction | Date | Error | Primitive | RegExp;

type DeepPartialArray<T> = DeepPartial<T>[];

type DeepPartial<T> = T extends BuiltIn
	? T
	: T extends Map<infer Key, infer Value>
		? Map<Key, Value>
		: T extends ReadonlyMap<infer Key, infer Value>
			? ReadonlyMap<Key, Value>
			: T extends Set<infer Value>
				? Set<Value>
				: T extends ReadonlySet<infer Value>
					? ReadonlySet<Value>
					: T extends Promise<infer Value>
						? Promise<Value>
						: T extends (infer U)[]
							? DeepPartialArray<U>
							: T extends object
								? { [K in keyof T]?: DeepPartial<T[K]> }
								: T;

export type { DeepPartial, PropertiesWithAsChild };
