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
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import { compose, prop, map, all } from '../util/utilities';
var Validation = /** @class */ (function () {
  function Validation(props) {
    var _this = this;
    this.createValidationsState = function (schema) {
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
    this.allValid = function (state) {
      var keys = Object.keys(state);
      var valid = keys.reduce(function (prev, current) {
        return prev
          ? _this.getFieldValid(current, _this._validationState)
          : prev;
      }, true);
      return valid;
    };
    /**
     * Executes the value against all provided validation functions and updates
     * the validation state.
     * @param key string the name of the property being validated
     * @param value any the value to be tested for validation
     * @return true/false validation
     */
    this.runAllValidators = function (property, value, state) {
      var runValidator = compose(function (func) {
        return func(value, state);
      }, prop('validation'));
      var bools = map(runValidator, _this._validationSchema[property]);
      var isValid = all(bools);
      var index = bools.indexOf(false);
      var error =
        index > -1 ? _this._validationSchema[property][index].errorMessage : '';
      var validations = {};
      validations[property] = { isValid: isValid, error: error };
      return validations;
    };
    /**
     * Get the current error stored for a property on the validation object.
     * @param property the name of the property to retrieve
     * @return string
     */
    this.getError = function (property) {
      if (property in _this._validationSchema) {
        var val = compose(prop('error'), prop(property));
        return val(_this._validationState);
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
    this.getFieldValid = function (property, vState) {
      if (vState === void 0) {
        vState = _this._validationState;
      }
      if (property in _this._validationSchema) {
        var val = compose(prop('isValid'), prop(property));
        return val(vState);
      }
      return true;
    };
    /**
     * Executes a validation function on a value and updates the validation state.
     * @param property string the name of the property being validated
     * @param value any the value to be tested for validation
     * @return boolean | undefined
     */
    this.validate = function (property, value, state) {
      if (property in _this._validationSchema) {
        var validations = _this.runAllValidators(property, value, state);
        var updated = __assign(
          __assign({}, _this._validationState),
          validations
        );
        _this._validationState = updated;
        var bool = validations[property].isValid;
        return bool;
      }
      return undefined;
    };
    /**
     * Runs all validations against an object with all values and updates/returns
     * isValid state.
     * @param state any an object that contains all values to be validated
     * @param props string[] property names to check (optional)
     * @return boolean
     */
    this.validateAll = function (state, props) {
      if (props === void 0) {
        props = Object.keys(_this._validationSchema);
      }
      var newState = props.reduce(function (acc, property) {
        var r = _this.runAllValidators(property, state[property], state);
        acc = __assign(__assign({}, acc), r);
        return acc;
      }, {});
      _this._validationState = newState;
      var result = _this.allValid(newState);
      return result;
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
    this.validateCustom = function (customValidations, object) {
      var bools = map(function (custom) {
        return object
          ? _this.validate(custom.key, custom.value, object)
          : _this.validate(custom.key, custom.value, {});
      }, customValidations);
      return all(bools);
    };
    /**
     * Updates the validation state if the validation succeeds.
     * @param key string the name of the property being validated
     * @param value any the value to be tested for validation
     * @return boolean | undefined
     */
    this.validateIfTrue = function (property, value, state) {
      if (property in _this._validationSchema) {
        var validations = _this.runAllValidators(property, value, state);
        if (validations[property].isValid) {
          var updated = __assign(
            __assign({}, _this._validationState),
            validations
          );
          _this._validationState = updated;
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
    this.validateOnBlur = function (state) {
      return function (event) {
        var _a = event.target,
          value = _a.value,
          name = _a.name;
        _this.validate(name, value, state);
      };
    };
    /**
     * Create a new onChange function that calls validateIfTrue on a property
     * matching the name of the event whenever a change event happens.
     * @param onChange function to handle onChange events
     * @param state the data controlling the form
     * @return function
     */
    this.validateOnChange = function (onChange, state) {
      return function (event) {
        var _a = event.target,
          value = _a.value,
          name = _a.name;
        _this.validateIfTrue(name, value, state);
        return onChange(event);
      };
    };
    this._validationSchema = props;
    this._validationState = this.createValidationsState(props);
  }
  Object.defineProperty(Validation.prototype, 'isValid', {
    get: function () {
      return this.allValid(this._validationState);
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(Validation.prototype, 'validationErrors', {
    get: function () {
      var _this = this;
      var props = Object.keys(this._validationState);
      var errors = props.reduce(function (prev, curr) {
        var err = _this.getError(curr);
        return err ? __spreadArrays(prev, [err]) : prev;
      }, []);
      return errors;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(Validation.prototype, 'validationState', {
    get: function () {
      return this._validationState;
    },
    enumerable: true,
    configurable: true,
  });
  return Validation;
})();
export { Validation };
//# sourceMappingURL=ValidationState.js.map
