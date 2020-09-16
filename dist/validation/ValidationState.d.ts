import { ChangeEvent } from 'react';
import { ValidationSchema, ValidationState, CustomValidation } from '../types';
export declare class Validation<S> {
  private _validationSchema;
  private _validationState;
  get isValid(): boolean;
  get validationErrors(): string[];
  get validationState(): ValidationState;
  constructor(props: ValidationSchema<S>);
  private createValidationsState;
  private allValid;
  /**
   * Executes the value against all provided validation functions and updates
   * the validation state.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return true/false validation
   */
  private runAllValidators;
  /**
   * Get the current error stored for a property on the validation object.
   * @param property the name of the property to retrieve
   * @return string
   */
  getError: (property: keyof S) => any;
  /**
   * Get the current valid state stored for a property on the validation object.
   * If the property does not exist on the validationSchema getFieldValid will
   * return true by default.
   * @param property the name of the property to retrieve
   * @return boolean
   */
  getFieldValid: (property: keyof S, vState?: ValidationState) => any;
  /**
   * Executes a validation function on a value and updates the validation state.
   * @param property string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  validate: (
    property: keyof S,
    value: unknown,
    state: S
  ) => boolean | undefined;
  /**
   * Runs all validations against an object with all values and updates/returns
   * isValid state.
   * @param state any an object that contains all values to be validated
   * @param props string[] property names to check (optional)
   * @return boolean
   */
  validateAll: (state: S, props?: string[]) => boolean;
  /**
   * Takes a unique data set and runs them against the defined schema. Only use
   * if you need to run validations on data where the validation props are
   * unable to follow the names of the properties of an object. Will return a
   * boolean and update validation state.
   * @param props string[] property names to check (optional)
   * @param object optional object
   * @return boolean
   */
  validateCustom: (
    customValidations: CustomValidation[],
    object?: S | undefined
  ) => any;
  /**
   * Updates the validation state if the validation succeeds.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  validateIfTrue: (
    property: keyof S,
    value: unknown,
    state: S
  ) => boolean | undefined;
  /**
   * Create a new onBlur function that calls validate on a property matching the
   * name of the event whenever a blur event happens.
   * @param state the data controlling the form
   * @return function
   */
  validateOnBlur: (state: S) => (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Create a new onChange function that calls validateIfTrue on a property
   * matching the name of the event whenever a change event happens.
   * @param onChange function to handle onChange events
   * @param state the data controlling the form
   * @return function
   */
  validateOnChange: (
    onChange: Function,
    state: S
  ) => (event: ChangeEvent<HTMLInputElement>) => any;
}
