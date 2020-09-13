import {ChangeEvent} from "react";
import {ValidationState, ValidationSchema } from "./validation.hook";
import {compose, prop, map, all} from "util/utilities";

class Validation<S> {
  isValid: boolean;
  schema: ValidationSchema<S>;
  validationErrors: string[];
  validationState: ValidationState;

  constructor(props: ValidationSchema<S>) {
    this.schema = props;
    this.allValid.bind(this);
    this.getError.bind(this);
    this.getFieldValid.bind(this);
    this.isValid = true;
    this.validate.bind(this);
    this.validateIfTrue.bind(this);
    this.validationErrors = [];
    this.validationState = this.createValidationsState(props);
  }

  // -- Build Validation State Object -------------------------------------
  private createValidationsState = (schema: ValidationSchema<S>) => {
    const keys = Object.keys(schema);
    const vState = keys.reduce(
      (prev: any, item: string) => {
        prev[item] = {
          isValid: true,
          error: ''
        };
        return prev;
      },
      {}
    );
    return vState;
  };

  // -- helper to update isValid state on change detection ----------------
  private allValid = (state: ValidationState) => {
    const keys = Object.keys(state);
    const valid = keys.reduce((prev: boolean, current: string) => {
      return prev
        ? this.getFieldValid(current as keyof S, this.validationState)
        : prev
    }, true);
    return valid;
  }

  /**
   * Executes the value against all provided validation functions and updates 
   * the validation state.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return true/false validation
   */
  private runAllValidators = (property: keyof S, value: any, state: S) => {
    const runValidator = compose(
      (func: Function) => func(value, state),
      prop('validation')
    );
    const bools: boolean[] = map(runValidator, this.schema[property as string]);
    const isValid: boolean = all(bools);
    const index: number = bools.indexOf(false);
    const error = index > -1
      ? this.schema[property as string][index].errorMessage
      : '';
    const validations: ValidationState = {};
    validations[property as string] = { isValid, error };
    return validations;
  };

  /**
   * Executes a validation function on a value and updates the validation state.
   * @param property string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  validate = (property: keyof S, value: unknown, state: S) => {
    if (property in this.schema) {
      const validations = this.runAllValidators(property, value, state);
      const updated = { ...this.validationState, ...validations };
      this.validationState = (updated);
      return validations[property as string].isValid;
    }
  };

  /**
   * Updates the validation state if the validation succeeds.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  validateIfTrue = (property: keyof S, value: unknown, state: S) => {
    if (property in this.schema) {
      const validations = this.runAllValidators(property, value, state);
      if (validations[property as string].isValid) {
        const updated = { ...this.validationState, ...validations };
        this.validationState = (updated)
      }
      return validations[property as string].isValid;
    }
  };

  /**
   * Create a new onBlur function that calls validate on a property matching the
   * name of the event whenever a blur event happens.
   * @param state the data controlling the form
   * @return function
   */
  validateOnBlur = (state: S) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value, name } = event.target;
      this.validate(name as keyof S, value, state);
    }
  }

  /**
   * Create a new onChange function that calls validateIfTrue on a property 
   * matching the name of the event whenever a change event happens.
   * @param onChange function to handle onChange events
   * @param state the data controlling the form
   * @return function
   */
  validateOnChange = (onChange: Function, state: S) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value, name } = event.target;
      this.validateIfTrue(name as keyof S, value, state);
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
  validateAll = (state: S, props: string[] = Object.keys(this.schema)) => {
    const newState = props.reduce((acc, property) => {
      const r = this.runAllValidators(
        property as keyof S,
        state[property as keyof S],
        state
      );
      acc = { ...acc, ...r };
      return acc;
    }, {});
    this.validationState = newState;
    const result = this.allValid(newState);
    this.isValid = result;
    return result;
  };

  /**
   * Get the current error stored for a property on the validation object.
   * @param property the name of the property to retrieve
   * @return string
   */
  getError = (property: keyof S) => {
    if (property as string in this.schema) {
      const val = compose(
        prop('error'),
        prop(property),
      );
      return val(this.validationState);
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
  getFieldValid = (
    property: keyof S,
    vState: ValidationState = this.validationState
  ) => {
    if (property as string in this.schema) {
      const val = compose(
        prop('isValid'),
        prop(property),
      );
      return val(vState);
    }
    return true;
  };



  // -- array of all current validation errors ----------------------------
  // validationErrors = map(this.getError, Object.keys(this.validationState));

}

export default Validation;
