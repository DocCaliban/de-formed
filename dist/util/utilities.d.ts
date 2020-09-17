/**
 * Creates a random 7 character string.
 * @return string
 */
export declare const randomString: () => string;
/**
 *  compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
 */
export declare const compose: (...fns: Function[]) => (...args: any[]) => any;
/**
 *  Evaluate any two values for deep equality
 *  @param a any value
 *  @param b any value
 *  @return boolean
 */
export declare const deepEqual: (a: unknown, b: unknown) => boolean;
export declare const upsertItem: <T>(
  items: T[],
  data: Partial<T>,
  index: number
) => T[];
/**
 *  curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
 */
export declare function curry(fn: Function): (...args: any[]) => any;
/**
 *  trim :: String -> String
 */
export declare const trim: (s: string) => string;
/**
 *  head :: [a] -> a
 */
export declare const head: (xs: any[]) => any;
/**
 *  map :: (a -> b) -> [a] -> [b]
 */
export declare const map: (...args: any[]) => any;
/**
 *  reduce :: ((b, a) -> b) -> b -> [a] -> b
 */
export declare const reduce: (...args: any[]) => any;
/**
 *  prop :: String -> {a} -> [a | Undefined]
 */
export declare const prop: (...args: any[]) => any;
export declare const all: any;
