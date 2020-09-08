import { useState } from 'react';
import { prop, map, all, indexOf, mergeDeepRight } from 'ramda';
import { createValidationsState, compose, isEqual } from 'util/utilities';
import { InputWrapper } from './wrapper2';

export interface ValidationArray<T> {
  key: keyof T;
  value: unknown;
}

export interface ErrorMessages {
  [key: string]: string;
}

export interface ValidationFunction {
  (val: any, state: any): boolean | string | number;
}

// Dictionary of Booleans
export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    error: string;
  };
}

// Dictionary of validation definitions
export interface ValidationProps {
  errorMessage: string;
  validation: ValidationFunction;
}

export interface ValidationSchema {
  [key: string]: ValidationProps[];
}

export interface ValidationObject {
  getError: Function;
  getFieldValid: Function;
  isValid: boolean;
  validate: Function;
  validateAll: Function;
  validateIfTrue: Function;
  validationState: ValidationState;
}

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all the properties you want to validate
 * @returns isValid True if all properties in validation state are true
 * @returns validationState True/false state of all keys
 * @returns validate Function
 * @returns validateIfTrue Function
 * @returns validateIfFalse Function
 * @returns validateAll Function
 * @returns errorMessages Object of all error messages organized by key
 */
export const useValidation = <S>(validationSchema: ValidationSchema) => {
  const [isValid, setIsValid] = useState<boolean>(true);

  const [validationState, setValidationState] = useState<ValidationState>(
    createValidationsState(validationSchema)
  );

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
      setIsValid(validations[key].isValid);
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
        setIsValid(validations[key].isValid);
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
    return result;
  };

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

  const validationObject = {
    getError,
    getFieldValid,
    isValid,
    validate,
    validateAll,
    validateIfTrue,
    validationState,
  }

  const ValidationWrap = InputWrapper(validationObject);

  return {
    ...validationObject,
    ValidationWrap
  };
};

