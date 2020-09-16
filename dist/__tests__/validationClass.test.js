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
import { Validation } from '../validation/ValidationState';
var schema = {
  name: [
    {
      errorMessage: 'Name is required.',
      validation: function (val) {
        return val.length > 0;
      },
    },
    {
      errorMessage: 'Cannot be bob.',
      validation: function (val) {
        return val !== 'bob';
      },
    },
    {
      errorMessage: 'Must be dingo.',
      validation: function (val, state) {
        return state.dingo ? val === 'dingo' : true;
      },
    },
  ],
  age: [
    {
      errorMessage: 'Must be 18.',
      validation: function (val) {
        return val >= 18;
      },
    },
  ],
};
var mockValidationState = {
  name: {
    isValid: true,
    error: '',
  },
  age: {
    isValid: true,
    error: '',
  },
};
var defaultState = {
  name: 'jack',
  dingo: false,
  age: 42,
};
var failingState = __assign(__assign({}, defaultState), {
  name: 'bob',
  age: 15,
});
describe('useValidation tests', function () {
  it('should be defined', function () {
    expect(Validation).toBeDefined();
  });
  it('builds the object correctly and checks types', function () {
    var v = new Validation(schema);
    expect(typeof v.getError).toBe('function');
    expect(typeof v.getFieldValid).toBe('function');
    expect(typeof v.isValid).toBe('boolean');
    expect(typeof v.validate).toBe('function');
    expect(typeof v.validateAll).toBe('function');
    expect(typeof v.validateIfTrue).toBe('function');
    expect(typeof v.validateOnBlur).toBe('function');
    expect(typeof v.validateOnChange).toBe('function');
    expect(Array.isArray(v.validationErrors)).toBe(true);
    expect(typeof v.validationState).toBe('object');
  });
  it('returns all functions and read-only objects defined by class', function () {
    var v = new Validation(schema);
    expect(v.validationState).toStrictEqual(mockValidationState);
    expect(Object.keys(v)).toStrictEqual([
      'createValidationsState',
      'allValid',
      'runAllValidators',
      'getError',
      'getFieldValid',
      'validate',
      'validateAll',
      'validateCustom',
      'validateIfTrue',
      'validateOnBlur',
      'validateOnChange',
      '_validationSchema',
      '_validationState',
    ]);
  });
  describe('getError', function () {
    it('returns an empty string by default', function () {
      var v = new Validation(schema);
      var output = v.getError('name');
      expect(output).toBe('');
    });
    it('returns an empty string if the property does not exist', function () {
      var v = new Validation(schema);
      var output = v.getError('balls');
      expect(output).toBe('');
    });
    it('retrieves an error message', function () {
      var v = new Validation(schema);
      var name = 'name';
      var value = '';
      var state = defaultState;
      v.validate(name, value, state);
      var output = v.getError('name');
      expect(output).toBe('Name is required.');
    });
  });
  describe('getFieldValid', function () {
    it('returns true by default', function () {
      var v = new Validation(schema);
      var output = v.getFieldValid('name');
      expect(output).toBe(true);
    });
    it('returns true if the property does not exist', function () {
      var v = new Validation(schema);
      var output = v.getFieldValid('balls');
      expect(output).toBe(true);
    });
    it('retrieves an invalid state', function () {
      var v = new Validation(schema);
      var name = 'name';
      var value = '';
      var state = defaultState;
      v.validate(name, value, state);
      var output = v.getFieldValid('name');
      expect(output).toBe(false);
    });
  });
  describe('isValid', function () {
    it('returns true by default', function () {
      var v = new Validation(schema);
      expect(v.isValid).toBe(true);
    });
    it('changes to false after a validation fails', function () {
      var output;
      var v = new Validation(schema);
      var state = defaultState;
      output = v.validate('name', 'bob', state);
      expect(v.isValid).toBe(output);
      expect(v.isValid).toBe(false);
    });
    it('changes to true after a failed validation passes', function () {
      var v = new Validation(schema);
      var state = defaultState;
      v.validate('name', 'bob', state);
      v.validate('name', 'bob ross', state);
      var output = v.isValid;
      expect(output).toBe(true);
    });
  });
  describe('validate', function () {
    it('returns a boolean if key exists', function () {
      var v = new Validation(schema);
      var output;
      var name = 'name';
      var value = 'bob';
      var state = defaultState;
      output = v.validate(name, value, state);
      expect(typeof output).toBe('boolean');
    });
    it('returns undefined if key does not exist', function () {
      var output;
      var v = new Validation(schema);
      var name = 'balls';
      var value = 'bob';
      var state = defaultState;
      output = v.validate(name, value, state);
      expect(typeof output).toBe('undefined');
    });
    it('updates the validationState when validation fails', function () {
      var v = new Validation(schema);
      var validationState = __assign(__assign({}, mockValidationState), {
        name: {
          isValid: false,
          error: 'Must be dingo.',
        },
      });
      var name = 'name';
      var value = 'chuck';
      var state = { dingo: true };
      v.validate(name, value, state);
      expect(v.isValid).toBe(false);
      expect(v.validationState).toStrictEqual(validationState);
    });
  });
  describe('validateAll', function () {
    it('returns a boolean', function () {
      var v = new Validation(schema);
      var output;
      output = v.validateAll(defaultState);
      expect(typeof output).toBe('boolean');
    });
    it('returns true if validations pass', function () {
      var v = new Validation(schema);
      var output;
      output = v.validateAll(defaultState);
      expect(output).toBe(true);
    });
    it('returns false if any validation fails', function () {
      var v = new Validation(schema);
      var output;
      output = v.validateAll(failingState);
      expect(output).toBe(false);
    });
  });
  describe('validateCustom', function () {
    var weirdSchema = {
      namesAreAllBob: [
        {
          errorMessage: 'Names all have to be bob.',
          validation: function (names) {
            return names.reduce(function (acc, name) {
              return acc ? name === 'bob' : false;
            }, true);
          },
        },
      ],
      namesAreAllDingo: [
        {
          errorMessage: 'Names all have to be dino if dingo is true.',
          validation: function (names, object) {
            return names.reduce(function (acc, name) {
              if (object.dingo === true) {
                return acc ? name === 'dingo' : false;
              }
              return true;
            }, true);
          },
        },
      ],
    };
    var validNames = ['bob', 'bob', 'bob'];
    it('returns a boolean', function () {
      var v = new Validation(weirdSchema);
      var output;
      output = v.validateCustom([{ key: 'namesAreAllBob', value: validNames }]);
      expect(typeof output).toBe('boolean');
    });
    it('returns true if validations pass', function () {
      var v = new Validation(weirdSchema);
      var output;
      output = v.validateCustom([{ key: 'namesAreAllBob', value: validNames }]);
      expect(output).toBe(true);
    });
    it('returns false if validations fail', function () {
      var v = new Validation(weirdSchema);
      var invalidNames = ['jack', 'bob', 'bob'];
      var output;
      output = v.validateCustom([
        { key: 'namesAreAllBob', value: invalidNames },
      ]);
      expect(output).toBe(false);
    });
    it('updates validation state', function () {
      var v = new Validation(weirdSchema);
      var invalidNames = ['jack', 'bob', 'bob'];
      v.validateCustom([{ key: 'namesAreAllBob', value: invalidNames }]);
      expect(v.isValid).toBe(false);
    });
    it('takes an optional object for second argument', function () {
      var v = new Validation(weirdSchema);
      var validNames = ['dingo', 'dingo', 'dingo'];
      v.validateCustom([{ key: 'namesAreAllDingo', value: validNames }], {
        dingo: true,
      });
      expect(v.isValid).toBe(true);
    });
  });
  describe('validateIfTrue', function () {
    it('returns a boolean if key exists', function () {
      var v = new Validation(schema);
      var output;
      var name = 'name';
      var value = 'bob';
      var state = defaultState;
      output = v.validateIfTrue(name, value, state);
      expect(typeof output).toBe('boolean');
    });
    it('returns undefined if key does not exist', function () {
      var v = new Validation(schema);
      var name = 'balls';
      var value = 'bob';
      var state = defaultState;
      var output;
      output = v.validateIfTrue(name, value, state);
      expect(typeof output).toBe('undefined');
    });
    it('does not update the validationState when validation fails', function () {
      var v = new Validation(schema);
      var validationState = __assign({}, mockValidationState);
      var name = 'name';
      var value = 'chuck';
      var state = { dingo: true };
      v.validateIfTrue(name, value, state);
      expect(v.isValid).toBe(true);
      expect(v.validationState).toStrictEqual(validationState);
    });
    // TODO: fix isValid
    it('updates the validationState when an invalid validation succeeds', function () {
      var v = new Validation(schema);
      var state = defaultState;
      var validationState = __assign({}, mockValidationState);
      v.validate('name', 'bob', state);
      expect(v.isValid).toBe(false);
      v.validateIfTrue('name', 'jack', state);
      expect(v.isValid).toBe(true);
      expect(v.validationState).toStrictEqual(validationState);
    });
  });
  describe('validateOnBlur', function () {
    it('returns a new function', function () {
      var v = new Validation(schema);
      var state = defaultState;
      var handleBlur = v.validateOnBlur(state);
      expect(typeof handleBlur).toBe('function');
    });
    it('updates the valdiation state when called', function () {
      var v = new Validation(schema);
      var state = defaultState;
      var handleBlur = v.validateOnBlur(state);
      var event = {
        target: {
          name: 'name',
          value: 'bob',
          dispatchEvent: new Event('blur'),
        },
      };
      handleBlur(event);
      expect(v.isValid).toBe(false);
    });
  });
  describe('validateOnChange', function () {
    it('returns a new function', function () {
      var v = new Validation(schema);
      var state = defaultState;
      var onChange = function (event) {
        return 'bob ross';
      };
      var handleChange = v.validateOnChange(onChange, state);
      expect(typeof handleChange).toBe('function');
    });
    it('updates the valdiation state if true and returns event', function () {
      var v = new Validation(schema);
      var state = defaultState;
      v.validate('name', 'bob', defaultState);
      expect(v.isValid).toBe(false);
      var onChange = function (event) {
        return 'bob ross';
      };
      var handleChange = v.validateOnChange(onChange, state);
      var event = {
        target: {
          name: 'name',
          value: 'jack',
          dispatchEvent: new Event('change'),
        },
      };
      var output;
      output = handleChange(event);
      expect(v.isValid).toBe(true);
      expect(output).toBe('bob ross');
    });
  });
  describe('validationErrors', function () {
    it('returns an empty array', function () {
      var v = new Validation(schema);
      expect(v.validationErrors).toStrictEqual([]);
    });
    it('returns an array of all errors', function () {
      var v = new Validation(schema);
      v.validateAll(failingState);
      expect(v.validationErrors).toStrictEqual([
        'Cannot be bob.',
        'Must be 18.',
      ]);
    });
  });
});
//# sourceMappingURL=validationClass.test.js.map
