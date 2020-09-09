import { curry } from 'ramda';

/**
 * Creates a random 7 character string.
 * @return string
 */
export const randomString = () => Math.random().toString(36).substring(7);

/**
 *  Compose function that is a little more friendly to use with typescript.
 *  @param fns any number of comma-separated functions
 *  @return new function
 */
export const compose = (...fns: Function[]) => (x: any) =>
  fns.reduceRight((y: any, f: any) => f(y), x);

// debug
export const trace = curry((txt: string, x: any) => {
  console.log(txt, x);
  return x;
});

/**
 *  Evaluate any two values for deep equality
 *  @param a any value
 *  @param b any value
 *  @return boolean
 */
export const deepEqual = (a: unknown, b: unknown) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

/**
 *  Curried function that executes deepEqual
 *  @param a any value
 *  @param b any value
 *  @return boolean
 */
export const isEqual = curry((a: any, b: any) => deepEqual(a, b));

