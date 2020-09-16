import { ChangeEvent } from 'react';
import { ValidationSchema, ValidationState, CustomValidation } from '../types';
/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all the properties you want to validate
 * @returns object { getError, getFieldValid, isValid, validate, validateAll, validateIfTrue, validateOnBlur, validateOnChange, validationState }
 */
export declare const useValidation: <S>(
  validationSchema: ValidationSchema<S>
) => {
  getError: (property: string, vState?: ValidationState) => any;
  getFieldValid: (property: string, vState?: ValidationState) => any;
  isValid: boolean;
  validate: (
    property: keyof S,
    value: unknown,
    state: S
  ) => boolean | undefined;
  validateAll: (state: S, props?: string[]) => boolean;
  validateCustom: (
    customValidations: CustomValidation[],
    object?: S | undefined
  ) => any;
  validateIfTrue: (
    property: keyof S,
    value: unknown,
    state: S
  ) => boolean | undefined;
  validateOnBlur: (state: S) => (event: ChangeEvent<HTMLInputElement>) => void;
  validateOnChange: (
    onChange: Function,
    state: S
  ) => (event: ChangeEvent<HTMLInputElement>) => any;
  validationErrors: any;
  validationState: ValidationState;
};
