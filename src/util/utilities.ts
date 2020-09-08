import { curry } from 'ramda';
import { FormEvent } from 'react';
import {ValidationSchema} from 'validation.hook';

interface KeyValuePair {
  [key: string]: any;
}

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

/**
 *  Curried function that takes the output of an HTMLInputElement Event and
 *  wraps it into an object by the name, then executes a given function and
 *  providing the key/value pair, the name, and the raw value as parameters.
 *  @param onChange Function to be executed with the event data
 *  @param name String of what the data should bind to on an object
 *  @param event HTMLInputElement Event
 *  @return void
 */
export const handleChange = curry(
  (onChange: Function, name: string, event: FormEvent<HTMLInputElement>) => {
    let data: KeyValuePair = {};
    if (!event) return;
    const { value } = event.currentTarget;
    data[name] = value;
    onChange(data, name, value);
  }
);

// Build Validation State Object
export const createValidationsState = (schema: ValidationSchema) => {
  const keys = Object.keys(schema);
  return keys.reduce(
    (prev: any, item: string) => {
      prev[item] = {
        isValid: true,
        error: ''
      };
      return prev;
    },
    {}
  );
};

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

