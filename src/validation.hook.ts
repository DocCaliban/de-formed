import { useState, useEffect } from 'react';
import { prop, map, all, indexOf, mergeDeepRight } from 'ramda';
import { createValidationsState, compose, isEqual, trace } from 'util/utilities';

export interface ValidationArray<T> {
  key: keyof T;
  value: unknown;
};

export interface ValidationFunction {
  (val: any, state: any): boolean;
};

export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    error: string;
  };
};

export interface ValidationProps {
  errorMessage: string;
  validation: ValidationFunction;
};

export interface ValidationSchema {
  [key: string]: ValidationProps[];
};

export interface ValidationObject {
  getError: Function;
  getFieldValid: Function;
  isValid: boolean;
  validate: Function;
  validateAll: Function;
  validateIfTrue: Function;
  validationErrors: string[];
  validationState: ValidationState;
};

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all the properties you want to validate
 * @returns object { getError, getFieldValid, isValid, validate, validateAll, validateIfTrue, validationState }
 */
export const useValidation = <S>(validationSchema: ValidationSchema) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [validationState, setValidationState] = useState<ValidationState>(
    createValidationsState(validationSchema)
  );

  /**
   * Executes the value against all provided validation functions and 
   * updates the state.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return true/false validation
   */
  const runAllValidators = (key: string, value: any, state?: S) => {
    const runValidator = compose(
      (func: Function) => func(value, state),
      prop('validation')
    );
    const bools: boolean[] = map(runValidator, validationSchema[key]);
    const isValid: boolean = all(isEqual(true), bools);
    const index: number = indexOf(false, bools);
    const error = index > -1 ? validationSchema[key][index].errorMessage : '';
    const validations: any = {};
    validations[key] = { isValid, error };
    return validations;
  }

  /**
   * executes a validation function on a value and updates isValid state
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return true/false validation
   */
  const validate = (key: string, value: any, state?: S) => {
    if (key in validationSchema) {
      const validations = runAllValidators(key, value, state);
      setValidationState(mergeDeepRight(validationState, validations));
      return validations[key].isValid;
    }
  };

  /**
   * updates isValid state if validation succeeds
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return void
   */
  const validateIfTrue = (key: string, value: unknown, state?: S) => {
    if (key in validationSchema) {
      const validations = runAllValidators(key, value, state);
      if (validations[key].isValid) {
        setValidationState(mergeDeepRight(validationState, validations));
      }
    }
  };

  /**
   * Runs all validations against an object with all values and updates/returns
   * isValid state.
   * @param state any an object that contains all values to be validated
   * @return boolean isValid state
   */
  const validateAll = (state: S) => {
    const bools = map((key: string) => {
      return validate(key, state[key as keyof S], state);
    }, Object.keys(validationSchema));

    const result = all(isEqual(true), bools);
    setIsValid(result);
    return result;
  };

  /**
   * Get the current error stored for a property on the validation object.
   * @param key the name of the property to retrieve
   * @return string
   */
  const getError = (key: string) => {
    if (key in validationSchema) {
      const val = compose(
        prop('error'),
        prop(key),
      );
      return val(validationState);
    }
    return '';
  };

  // array of all current validation errors
  const validationErrors = map(getError, Object.keys(validationState));

  /**
   * Get the current valid state stored for a property on the validation object.
   * @param key the name of the property to retrieve
   * @return boolean
   */
  const getFieldValid = (key: string) => {
    if (key in validationSchema) {
      const val = compose(
        prop('isValid'),
        prop(key),
      );
      return val(validationState);
    }
    return true;
  };

  // helper to update isValid state on change detection
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
    validationErrors,
    validationState,
  }
};

