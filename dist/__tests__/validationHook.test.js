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
import { renderHook, act } from '@testing-library/react-hooks';
import { useValidation } from '../validation/validation.hook';
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
      errorMessage: 'Must be 18',
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
    expect(useValidation).toBeDefined();
  });
  it('renders the hook correctly and checks types', function () {
    var result = renderHook(function () {
      return useValidation(schema);
    }).result;
    expect(typeof result.current.getError).toBe('function');
    expect(typeof result.current.getFieldValid).toBe('function');
    expect(typeof result.current.isValid).toBe('boolean');
    expect(typeof result.current.validate).toBe('function');
    expect(typeof result.current.validateAll).toBe('function');
    expect(typeof result.current.validateIfTrue).toBe('function');
    expect(typeof result.current.validateOnBlur).toBe('function');
    expect(typeof result.current.validateOnChange).toBe('function');
    expect(Array.isArray(result.current.validationErrors)).toBe(true);
    expect(typeof result.current.validationState).toBe('object');
  });
  it('returns all functions and read-only objects defined by hook', function () {
    var result = renderHook(function () {
      return useValidation(schema);
    }).result;
    expect(result.current.validationState).toStrictEqual(mockValidationState);
    expect(Object.keys(result.current)).toStrictEqual([
      'getError',
      'getFieldValid',
      'isValid',
      'validate',
      'validateAll',
      'validateCustom',
      'validateIfTrue',
      'validateOnBlur',
      'validateOnChange',
      'validationErrors',
      'validationState',
    ]);
  });
  describe('getError', function () {
    it('returns an empty string by default', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output = result.current.getError('name');
      expect(output).toBe('');
    });
    it('returns an empty string if the property does not exist', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output = result.current.getError('balls');
      expect(output).toBe('');
    });
    it('retrieves an error message', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var name = 'name';
      var value = '';
      var state = defaultState;
      act(function () {
        result.current.validate(name, value, state);
      });
      var output = result.current.getError('name');
      expect(output).toBe('Name is required.');
    });
  });
  describe('getFieldValid', function () {
    it('returns true by default', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output = result.current.getFieldValid('name');
      expect(output).toBe(true);
    });
    it('returns true if the property does not exist', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output = result.current.getFieldValid('balls');
      expect(output).toBe(true);
    });
    it('retrieves an invalid state', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var name = 'name';
      var value = '';
      var state = defaultState;
      act(function () {
        result.current.validate(name, value, state);
      });
      var output = result.current.getFieldValid('name');
      expect(output).toBe(false);
    });
  });
  describe('isValid', function () {
    it('returns true by default', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output = result.current.isValid;
      expect(output).toBe(true);
    });
    it('changes to false after a validation fails', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var name = 'name';
      var value = 'bob';
      var state = defaultState;
      act(function () {
        result.current.validate(name, value, state);
      });
      var output = result.current.isValid;
      expect(output).toBe(false);
    });
    it('changes to true after a failed validation passes', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var name = 'name';
      var value = 'bob';
      var state = defaultState;
      act(function () {
        result.current.validate(name, value, state);
        result.current.validate(name, 'bob ross', state);
      });
      var output = result.current.isValid;
      expect(output).toBe(true);
    });
  });
  describe('validate', function () {
    it('returns a boolean if key exists', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output;
      var name = 'name';
      var value = 'bob';
      var state = defaultState;
      act(function () {
        output = result.current.validate(name, value, state);
      });
      expect(typeof output).toBe('boolean');
    });
    it('returns undefined if key does not exist', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var name = 'balls';
      var value = 'bob';
      var state = defaultState;
      var output;
      act(function () {
        output = result.current.validate(name, value, state);
      });
      expect(typeof output).toBe('undefined');
    });
    it('updates the validationState when validation fails', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var validationState = __assign(__assign({}, mockValidationState), {
        name: {
          isValid: false,
          error: 'Must be dingo.',
        },
      });
      var name = 'name';
      var value = 'chuck';
      var state = { dingo: true };
      act(function () {
        result.current.validate(name, value, state);
      });
      expect(result.current.isValid).toBe(false);
      expect(result.current.validationState).toStrictEqual(validationState);
    });
  });
  describe('validateAll', function () {
    it('returns a boolean', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output;
      act(function () {
        output = result.current.validateAll(defaultState);
      });
      expect(typeof output).toBe('boolean');
    });
    it('returns true if validations pass', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output;
      act(function () {
        output = result.current.validateAll(defaultState);
      });
      expect(output).toBe(true);
    });
    it('returns false if any validation fails', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output;
      act(function () {
        output = result.current.validateAll(failingState);
      });
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
      var result = renderHook(function () {
        return useValidation(weirdSchema);
      }).result;
      var output;
      act(function () {
        output = result.current.validateCustom([
          { key: 'namesAreAllBob', value: validNames },
        ]);
      });
      expect(typeof output).toBe('boolean');
    });
    it('returns true if validations pass', function () {
      var result = renderHook(function () {
        return useValidation(weirdSchema);
      }).result;
      var output;
      act(function () {
        output = result.current.validateCustom([
          { key: 'namesAreAllBob', value: validNames },
        ]);
      });
      expect(output).toBe(true);
    });
    it('returns false if validations fail', function () {
      var result = renderHook(function () {
        return useValidation(weirdSchema);
      }).result;
      var invalidNames = ['jack', 'bob', 'bob'];
      var output;
      act(function () {
        output = result.current.validateCustom([
          { key: 'namesAreAllBob', value: invalidNames },
        ]);
      });
      expect(output).toBe(false);
    });
    it('updates validation state', function () {
      var result = renderHook(function () {
        return useValidation(weirdSchema);
      }).result;
      var invalidNames = ['jack', 'bob', 'bob'];
      act(function () {
        result.current.validateCustom([
          { key: 'namesAreAllBob', value: invalidNames },
        ]);
      });
      expect(result.current.isValid).toBe(false);
    });
    it('takes an optional object for second argument', function () {
      var result = renderHook(function () {
        return useValidation(weirdSchema);
      }).result;
      var validNames = ['dingo', 'dingo', 'dingo'];
      act(function () {
        result.current.validateCustom(
          [{ key: 'namesAreAllDingo', value: validNames }],
          { dingo: true }
        );
      });
      expect(result.current.isValid).toBe(true);
    });
  });
  describe('validateIfTrue', function () {
    it('returns a boolean if key exists', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var output;
      var name = 'name';
      var value = 'bob';
      var state = defaultState;
      act(function () {
        output = result.current.validateIfTrue(name, value, state);
      });
      expect(typeof output).toBe('boolean');
    });
    it('returns undefined if key does not exist', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var name = 'balls';
      var value = 'bob';
      var state = defaultState;
      var output;
      act(function () {
        output = result.current.validateIfTrue(name, value, state);
      });
      expect(typeof output).toBe('undefined');
    });
    it('updates the validationState when validation fails', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var validationState = __assign({}, mockValidationState);
      var name = 'name';
      var value = 'chuck';
      var state = { dingo: true };
      act(function () {
        result.current.validateIfTrue(name, value, state);
      });
      expect(result.current.isValid).toBe(true);
      expect(result.current.validationState).toStrictEqual(validationState);
    });
    it('updates the validationState when an invalid validation succeeds', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var state = defaultState;
      var validationState = __assign({}, mockValidationState);
      act(function () {
        result.current.validate('name', 'bob', state);
      });
      expect(result.current.isValid).toBe(false);
      act(function () {
        result.current.validateIfTrue('name', 'jack', state);
      });
      expect(result.current.isValid).toBe(true);
      expect(result.current.validationState).toStrictEqual(validationState);
    });
  });
  describe('validateOnBlur', function () {
    it('returns a new function', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var state = defaultState;
      var handleBlur = result.current.validateOnBlur(state);
      expect(typeof handleBlur).toBe('function');
    });
    it('updates the valdiation state when called', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var state = defaultState;
      var handleBlur = result.current.validateOnBlur(state);
      var event = {
        target: {
          name: 'name',
          value: 'bob',
          dispatchEvent: new Event('blur'),
        },
      };
      act(function () {
        handleBlur(event);
      });
      expect(result.current.isValid).toBe(false);
    });
  });
  describe('validateOnChange', function () {
    it('returns a new function', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var state = defaultState;
      var onChange = function (event) {
        return 'bob ross';
      };
      var handleChange = result.current.validateOnChange(onChange, state);
      expect(typeof handleChange).toBe('function');
    });
    it('updates the valdiation state if true and returns event', function () {
      var result = renderHook(function () {
        return useValidation(schema);
      }).result;
      var state = defaultState;
      act(function () {
        result.current.validate('name', 'bob', defaultState);
      });
      expect(result.current.isValid).toBe(false);
      var onChange = function (event) {
        return 'bob ross';
      };
      var handleChange = result.current.validateOnChange(onChange, state);
      var event = {
        target: {
          name: 'name',
          value: 'jack',
          dispatchEvent: new Event('change'),
        },
      };
      var output;
      act(function () {
        output = handleChange(event);
      });
      expect(result.current.isValid).toBe(true);
      expect(output).toBe('bob ross');
    });
  });
});
//# sourceMappingURL=validationHook.test.js.map
