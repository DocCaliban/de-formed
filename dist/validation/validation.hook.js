var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import { useState, useEffect, useCallback } from 'react';
import { compose, prop, map, all } from '../util/utilities';
/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all the properties you want to validate
 * @returns object { getError, getFieldValid, isValid, validate, validateAll, validateIfTrue, validateOnBlur, validateOnChange, validationState }
 */
export var useValidation = function (validationSchema) {
  // -- Build Validation State Object -------------------------------------
  var createValidationsState = function (schema) {
    var keys = Object.keys(schema);
    var vState = keys.reduce(function (prev, item) {
      prev[item] = {
        isValid: true,
        error: '',
      };
      return prev;
    }, {});
    return vState;
  };
  // -- isValid and validationState ---------------------------------------
  var _a = useState(true),
    isValid = _a[0],
    setIsValid = _a[1];
  var _b = useState(createValidationsState(validationSchema)),
    validationState = _b[0],
    setValidationState = _b[1];
  /**
   * Executes the value against all provided validation functions and updates
   * the validation state.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return true/false validation
   */
  var runAllValidators = function (property, value, state) {
    var val = typeof value === 'string' ? value.trim() : value;
    var runValidator = compose(function (func) {
      return func(val, state);
    }, prop('validation'));
    var bools = map(runValidator, validationSchema[property]);
    var isValid = all(bools);
    var index = bools.indexOf(false);
    var error =
      index > -1 ? validationSchema[property][index].errorMessage : '';
    var validations = {};
    validations[property] = { isValid: isValid, error: error };
    return validations;
  };
  /**
   * Executes a validation function on a value and updates the validation state.
   * @param property string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  var validate = function (property, value, state) {
    if (property in validationSchema) {
      var validations = runAllValidators(property, value, state);
      var updated = __assign(__assign({}, validationState), validations);
      setValidationState(updated);
      return validations[property].isValid;
    }
    return undefined;
  };
  /**
   * Takes a unique data set and runs them against the defined schema. Only use
   * if you need to run validations on data where the validation props are
   * unable to follow the names of the properties of an object. Will return a
   * boolean and update validation state.
   * @param props string[] property names to check (optional)
   * @param object optional object
   * @return boolean
   */
  var validateCustom = function (customValidations, object) {
    var bools = map(function (custom) {
      return object
        ? validate(custom.key, custom.value, object)
        : validate(custom.key, custom.value, {});
    }, customValidations);
    return all(bools);
  };
  /**
   * Updates the validation state if the validation succeeds.
   * @param key string the name of the property being validated
   * @param value any the value to be tested for validation
   * @return boolean | undefined
   */
  var validateIfTrue = function (property, value, state) {
    if (property in validationSchema) {
      var validations = runAllValidators(property, value, state);
      if (validations[property].isValid) {
        setValidationState(
          __assign(__assign({}, validationState), validations)
        );
      }
      return validations[property].isValid;
    }
    return undefined;
  };
  /**
   * Create a new onBlur function that calls validate on a property matching the
   * name of the event whenever a blur event happens.
   * @param state the data controlling the form
   * @return function
   */
  var validateOnBlur = function (state) {
    return function (event) {
      var _a = event.target,
        value = _a.value,
        name = _a.name;
      validate(name, value, state);
    };
  };
  /**
   * Create a new onChange function that calls validateIfTrue on a property
   * matching the name of the event whenever a change event happens.
   * @param onChange function to handle onChange events
   * @param state the data controlling the form
   * @return function
   */
  var validateOnChange = function (onChange, state) {
    return function (event) {
      var _a = event.target,
        value = _a.value,
        name = _a.name;
      validateIfTrue(name, value, state);
      return onChange(event);
    };
  };
  /**
   * Runs all validations against an object with all values and updates/returns
   * isValid state.
   * @param state any an object that contains all values to be validated
   * @param props string[] property names to check (optional)
   * @return boolean
   */
  var validateAll = function (state, props) {
    if (props === void 0) {
      props = Object.keys(validationSchema);
    }
    var newState = props.reduce(function (acc, property) {
      var r = runAllValidators(property, state[property], state);
      acc = __assign(__assign({}, acc), r);
      return acc;
    }, {});
    setValidationState(newState);
    var result = allValid(newState);
    setIsValid(result);
    return result;
  };
  /**
   * Get the current error stored for a property on the validation object.
   * @param property the name of the property to retrieve
   * @return string
   */
  var getError = function (property, vState) {
    if (vState === void 0) {
      vState = validationState;
    }
    if (property in validationSchema) {
      var val = compose(prop('error'), prop(property));
      return val(vState) ? val(vState) : '';
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
  var getFieldValid = function (property, vState) {
    if (vState === void 0) {
      vState = validationState;
    }
    if (property in validationSchema) {
      var val = compose(prop('isValid'), prop(property));
      return val(vState);
    }
    return true;
  };
  // -- array of all current validation errors ----------------------------
  var validationErrors = map(getError, Object.keys(validationState));
  // -- helper to determine if a new validation state is valid ------------
  var allValid = function (state) {
    var keys = Object.keys(state);
    var valid = keys.reduce(function (prev, current) {
      return prev ? getFieldValid(current, state) : prev;
    }, true);
    return valid;
  };
  // -- memoized allValid to update state on change detection -------------
  var updateIsValid = useCallback(allValid, [validationState]);
  useEffect(
    function () {
      setIsValid(updateIsValid(validationState));
    },
    [validationState, updateIsValid]
  );
  return {
    getError: getError,
    getFieldValid: getFieldValid,
    isValid: isValid,
    validate: validate,
    validateAll: validateAll,
    validateCustom: validateCustom,
    validateIfTrue: validateIfTrue,
    validateOnBlur: validateOnBlur,
    validateOnChange: validateOnChange,
    validationErrors: validationErrors,
    validationState: validationState,
  };
};
//# sourceMappingURL=validation.hook.js.map
