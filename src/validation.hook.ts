import { useState, useEffect } from 'react';
import { prop, map, all, indexOf, mergeDeepRight } from 'ramda';
import { compose, isEqual } from 'util/utilities';

interface ValidationFunction<S> {
  (val: any, state: S): boolean;
};

interface ValidationProps<S> {
  errorMessage: string;
  validation: ValidationFunction<S>;
};

interface ValidationSchema<S> {
  [key: string]: ValidationProps<S>[];
};

export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    error: string;
  };
};

export interface ValidationObject {
  getError: (property: string) => string;
  getFieldValid: (property: string) => boolean;
  isValid: boolean;
  validate: (property: string, value: unknown, state?: any) => boolean | undefined;
  validateAll: (state: any) => boolean;
  validateIfTrue: (property: string, value: unknown, state?: any) => boolean | undefined;
  validationErrors: string[];
  validationState: ValidationState;
};

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all the properties you want to validate
 * @returns object { getError, getFieldValid, isValid, validate, validateAll, validateIfTrue, validationState }
 */
export const useValidation = <S>(validationSchema: ValidationSchema<S>) => {

  // -- Build Validation State Object -------------------------------------
  const createValidationsState = (schema: ValidationSchema<S>) => {
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

  // -- isValid and validationState ---------------------------------------
  const [isValid, setIsValid] = useState<boolean>(true);
  const [validationState, setValidationState] = useState<ValidationState>(
    createValidationsState(validationSchema)
  );

  /**
   * Executes the value against all provided validation functions and updates 
   * the validation state.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return true/false validation
   */
  const runAllValidators = (property: string, value: any, state?: S) => {
    const runValidator = compose(
      (func: Function) => func(value, state),
      prop('validation')
    );
    const bools: boolean[] = map(runValidator, validationSchema[property]);
    const isValid: boolean = all(isEqual(true), bools);
    const index: number = indexOf(false, bools);
    const error = index > -1
      ? validationSchema[property][index].errorMessage
      : '';
    const validations: ValidationState = {};
    validations[property] = { isValid, error };
    return validations;
  }

  /**
   * Executes a validation function on a value and updates the validation state.
   * @param property string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  const validate = (property: string, value: unknown, state?: S) => {
    if (property in validationSchema) {
      const validations = runAllValidators(property, value, state);
      const updated = mergeDeepRight(validationState, validations);
      setValidationState(updated);
      return validations[property].isValid;
    }
  };

  /**
   * Updates the validation state if the validation succeeds.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  const validateIfTrue = (property: string, value: unknown, state?: S) => {
    if (property in validationSchema) {
      const validations = runAllValidators(property, value, state);
      if (validations[property].isValid) {
        setValidationState(mergeDeepRight(validationState, validations));
      }
      return validations[property].isValid;
    }
  };

  /**
   * Runs all validations against an object with all values and updates/returns
   * isValid state. 
   * @param state any an object that contains all values to be validated
   * @param props string[] property names to check (optional)
   * @return boolean
   */
  const validateAll = (
    state: S,
    props: string[] = Object.keys(validationSchema)
  ) => {
    const newState = props.reduce((acc: any, property: string) => {
      const r = runAllValidators(property, state[property as keyof S], state);
      acc = mergeDeepRight(acc, r);
      return acc;
    }, {});
    setValidationState(newState);
    const result = allValid(newState);
    setIsValid(result);
    return result;
  };

  /**
   * Get the current error stored for a property on the validation object.
   * @param property the name of the property to retrieve
   * @return string
   */
  const getError = (property: string) => {
    if (property in validationSchema) {
      const val = compose(
        prop('error'),
        prop(property),
      );
      return val(validationState);
    }
    return '';
  };

  /**
   * Get the current valid state stored for a property on the validation object.
   * If the property does not exist on the validationSchema getFieldValid will 
   * return true by default.
   * @param property the name of the property to retrieve
   * @return boolean
   */
  const getFieldValid = (property: string) => {
    if (property in validationSchema) {
      const val = compose(
        prop('isValid'),
        prop(property),
      );
      return val(validationState);
    }
    return true;
  };

  /**
   * Create a new onChange function that updates the validationState behind
   * the scenes. Name must reflect the name of the input.
   * @param property the name of the property to retrieve
   * @return boolean
   */
  const validateOnChange = (onChange: Function, state: any) => (
    (event: any) => {
      const { value, name } = event.target;
      validateIfTrue(name, value, state);
      return onChange(event);
    }
  );

  // -- array of all current validation errors ----------------------------
  const validationErrors = map(getError, Object.keys(validationState));

  // -- helper to update isValid state on change detection ----------------
  const allValid = compose(
    all(isEqual(true)),
    map(getFieldValid)
  );

  useEffect(() => {
    setIsValid(allValid(Object.keys(validationState)));
  }, [validationState, allValid]);

  return {
    getError,
    getFieldValid,
    isValid,
    validate,
    validateAll,
    validateIfTrue,
    validateOnChange,
    validationErrors,
    validationState,
  };
};

