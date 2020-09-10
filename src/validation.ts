import React from 'react';
import {ValidationState, ValidationSchema} from "types/validation.type";
import {createValidationsState} from "util/validationHelpers";
import {compose, isEqual} from "util/utilities";
import {prop, map, all, indexOf, mergeDeepRight} from "ramda";

class Validation<S> extends React.Component {
  isValid: boolean;
  schema: ValidationSchema<S>;
  state: ValidationState;

  constructor(props: ValidationSchema<S>) {
    super(props);
    console.log('wtf')
    this.isValid = false;
    this.state = createValidationsState(props);
    this.schema = props;
  }
  /**
   * Executes the value against all provided validation functions and updates 
   * the validation state.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return true/false validation
   */
  runAllValidators(property: string, value: any, state?: any) {
    const runValidator = compose(
      (func: Function) => func(value, state),
      prop('validation')
    );
    const bools: boolean[] = map(runValidator, this.schema[property]);
    const isValid: boolean = all(isEqual(true), bools);
    const index: number = indexOf(false, bools);
    const error = index > -1
      ? this.schema[property][index].errorMessage
      : '';
    const validations: ValidationState = {};
    validations[property] = { isValid, error };
    return validations;
  };

  /**
   * Executes a validation function on a value and updates the validation state.
   * @param property string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  validate(property: string, value: unknown, state?: any) {
    if (property in this.schema) {
      const validations = this.runAllValidators(property, value, state);
      const updated = mergeDeepRight(this.state, validations);
      this.setState(updated);
      return validations[property].isValid;
    }
  };

  /**
   * Updates the validation state if the validation succeeds.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  validateIfTrue(property: string, value: unknown, state?: S) {
    if (property in this.schema) {
      const validations = this.runAllValidators(property, value, state);
      if (validations[property].isValid) {
        const updated = mergeDeepRight(this.state, validations);
        this.setState(updated)
      }
      return validations[property].isValid;
    }
  };

  /**
   * Create a new onBlur function that calls validate on a property matching the
   * name of the event whenever a blur event happens.
   * @param state the data controlling the form
   * @return function
   */
  validateOnBlur(state: any) {
    const self = this;
    return function(event: any) {
      const { value, name } = event.target;
      self.validate(name, value, state);
    }
  }

  /**
   * Create a new onChange function that calls validateIfTrue on a property 
   * matching the name of the event whenever a change event happens.
   * @param onChange function to handle onChange events
   * @param state the data controlling the form
   * @return function
   */
  validateOnChange(onChange: Function, state: any) {
    const self = this;
    return function(event: any) {
      const { value, name } = event.target;
      self.validateIfTrue(name, value, state);
      return onChange(event);
    }
  }

  /**
   * Runs all validations against an object with all values and updates/returns
   * isValid state. 
   * @param state any an object that contains all values to be validated
   * @param props string[] property names to check (optional)
   * @return boolean
   */
  validateAll(state: S, props: string[] = Object.keys(this.schema)) {
    const newState = props.reduce((acc: any, property: string) => {
      const r = this.runAllValidators(
        property,
        state[property as keyof S],
        state
      );
      acc = mergeDeepRight(acc, r);
      return acc;
    }, {});
    this.setState(newState)
    const result = this.allValid(newState);
    this.isValid = result;
    return result;
  };

  /**
   * Get the current error stored for a property on the validation object.
   * @param property the name of the property to retrieve
   * @return string
   */
  getError = (property: string) => {
    if (property in this.schema) {
      const val = compose(
        prop('error'),
        prop(property),
      );
      return val(this.state);
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
  getFieldValid(property: string) {
    if (property in this.schema) {
      const val = compose(
        prop('isValid'),
        prop(property),
      );
      return val(this.state);
    }
    return true;
  };



  // -- array of all current validation errors ----------------------------
  validationErrors = map(this.getError, Object.keys(this.state));

  // -- helper to update isValid state on change detection ----------------
  allValid = compose(
    all(isEqual(true)),
    map(this.getFieldValid)
  );


}

export default Validation;
