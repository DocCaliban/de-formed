import { ValidationSchema, ValidationState } from 'validation/validation.hook';
import Validation from 'validation';

const schema: ValidationSchema<any> = {
  name: [
    {
      errorMessage: 'Name is required.',
      validation: (val: string) => val.length > 0,
    },
    {
      errorMessage: 'Cannot be bob.',
      validation: (val: string) => val !== 'bob',
    },
    {
      errorMessage: 'Must be dingo.',
      validation: (val: string, state: any) => {
        return state.dingo ? val === 'dingo' : true;
      }
    },
  ],
  age: [
    {
      errorMessage: 'Must be 18.',
      validation: (val: number) => val >= 18,
    }
  ]
};

const mockValidationState: ValidationState = {
  name: {
    isValid: true,
    error: '',
  },
  age: {
    isValid: true,
    error: '',
  }
};

const defaultState = {
  name: 'jack',
  dingo: false,
  age: 42,
};

const failingState = {
  ...defaultState,
  name: 'bob',
  age: 15,
};

describe('useValidation tests', () => {

  it('should be defined', () => {
    expect(Validation).toBeDefined();
  });

  it('renders the hook correctly and checks types', () => {
    const v = new Validation(schema);
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

  it('returns all functions and read-only objects defined by class', () => {
    const v = new Validation(schema);
    expect(v.validationState).toStrictEqual(mockValidationState);
    expect(Object.keys(v)).toStrictEqual([
      '_validationSchema',
      '_validationState',
      'createValidationsState',
      'allValid',
      'runAllValidators',
      'getError',
      'getFieldValid',
      'validate',
      'validateAll',
      'validateIfTrue',
      'validateOnBlur',
      'validateOnChange',
    ]);
  });

  describe('getError', () => {
    it('returns an empty string by default', () => {
      const v = new Validation(schema);
      const output = v.getError('name');
      expect(output).toBe('');
    });

    it('returns an empty string if the property does not exist', () => {
      const v = new Validation(schema);
      const output = v.getError('balls');
      expect(output).toBe('');
    });

    it('retrieves an error message', () => {
      const v = new Validation(schema);
      const name = 'name';
      const value = '';
      const state = defaultState;
      v.validate(name, value, state);
      const output = v.getError('name');
      expect(output).toBe('Name is required.');
    });
  });

  describe('getFieldValid', () => {
    it('returns true by default', () => {
      const v = new Validation(schema);
      const output = v.getFieldValid('name');
      expect(output).toBe(true);
    });

    it('returns true if the property does not exist', () => {
      const v = new Validation(schema);
      const output = v.getFieldValid('balls');
      expect(output).toBe(true);
    });

    it('retrieves an invalid state', () => {
      const v = new Validation(schema);
      const name = 'name';
      const value = '';
      const state = defaultState;
      v.validate(name, value, state);
      const output = v.getFieldValid('name');
      expect(output).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true by default', () => {
      const v = new Validation(schema);
      expect(v.isValid).toBe(true);
    });

    it('changes to false after a validation fails', () => {
      let output: boolean | undefined;
      const v = new Validation(schema);
      const state = defaultState;
      output = v.validate('name', 'bob', state);
      expect(v.isValid).toBe(output);
      expect(v.isValid).toBe(false);
    });

    it('changes to true after a failed validation passes', () => {
      const v = new Validation(schema);
      const state = defaultState;
      v.validate('name', 'bob', state);
      v.validate('name', 'bob ross', state);
      const output = v.isValid;
      expect(output).toBe(true);
    });
  });

  describe('validate', () => {
    it('returns a boolean if key exists', () => {
      const v = new Validation(schema);
      let output: boolean | undefined;
      const name = 'name';
      const value = 'bob';
      const state = defaultState;
      output = v.validate(name, value, state);
      expect(typeof output).toBe('boolean');
    });

    it('returns undefined if key does not exist', () => {
      let output: boolean | undefined;
      const v = new Validation(schema);
      const name = 'balls';
      const value = 'bob';
      const state = defaultState;
      output = v.validate(name, value, state);
      expect(typeof output).toBe('undefined');
    });

    it('updates the validationState when validation fails', () => {
      const v = new Validation(schema);
      const validationState = {
        ...mockValidationState,
        name: {
          isValid: false,
          error: 'Must be dingo.'
        }
      }
      const name = 'name';
      const value = 'chuck';
      const state = { dingo: true };
      v.validate(name, value, state);
      expect(v.isValid).toBe(false);
      expect(v.validationState).toStrictEqual(validationState)
    });

  });

  describe('validateAll', () => {
    it('returns a boolean', () => {
      const v = new Validation(schema);
      let output: boolean | undefined;
      output = v.validateAll(defaultState);
      expect(typeof output).toBe('boolean');
    });

    it('returns true if validations pass', () => {
      const v = new Validation(schema);
      let output: boolean | undefined;
      output = v.validateAll(defaultState);
      expect(output).toBe(true);
    });

    it('returns false if any validation fails', () => {
      const v = new Validation(schema);
      let output: boolean | undefined;
      output = v.validateAll(failingState);
      expect(output).toBe(false);
    });
  });

  describe('validateIfTrue', () => {
    it('returns a boolean if key exists', () => {
      const v = new Validation(schema);
      let output: boolean | undefined;
      const name = 'name';
      const value = 'bob';
      const state = defaultState;
      output = v.validateIfTrue(name, value, state);
      expect(typeof output).toBe('boolean');
    });

    it('returns undefined if key does not exist', () => {
      const v = new Validation(schema);
      const name = 'balls';
      const value = 'bob';
      const state = defaultState;
      let output: boolean | undefined;
      output = v.validateIfTrue(name, value, state);
      expect(typeof output).toBe('undefined');
    });

    it('does not update the validationState when validation fails', () => {
      const v = new Validation(schema);
      const validationState = {
        ...mockValidationState,
      }
      const name = 'name';
      const value = 'chuck';
      const state = { dingo: true };
      v.validateIfTrue(name, value, state);
      expect(v.isValid).toBe(true);
      expect(v.validationState).toStrictEqual(validationState)
    });

    // TODO: fix isValid
    it('updates the validationState when an invalid validation succeeds', () => {
      const v = new Validation(schema);
      const state = defaultState;
      const validationState = {
        ...mockValidationState,
      }
      v.validate('name', 'bob', state);
      expect(v.isValid).toBe(false);
      v.validateIfTrue('name', 'jack', state);
      expect(v.isValid).toBe(true);
      expect(v.validationState).toStrictEqual(validationState)
    });

  });

  describe('validateOnBlur', () => {
    it('returns a new function', () => {
      const v = new Validation(schema);
      const state = defaultState;
      const handleBlur = v.validateOnBlur(state);
      expect(typeof handleBlur).toBe('function');
    });

    it('updates the valdiation state when called', () => {
      const v = new Validation(schema);
      const state = defaultState;
      const handleBlur = v.validateOnBlur(state);
      const event = {
        target: {
          name: 'name',
          value: 'bob',
          dispatchEvent: new Event('blur'),
        },
      };
      handleBlur(event as any);
      expect(v.isValid).toBe(false);
    });

  });

  describe('validateOnChange', () => {
    it('returns a new function', () => {
      const v = new Validation(schema);
      const state = defaultState;
      const onChange = (event: any) => 'bob ross';
      const handleChange = v.validateOnChange(onChange, state);
      expect(typeof handleChange).toBe('function');
    });

    it('updates the valdiation state if true and returns event', () => {
      const v = new Validation(schema);
      const state = defaultState;
      v.validate('name', 'bob', defaultState);
      expect(v.isValid).toBe(false);
      const onChange = (event: any) => 'bob ross';
      const handleChange = v.validateOnChange(onChange, state);
      const event = {
        target: {
          name: 'name',
          value: 'jack',
          dispatchEvent: new Event('change'),
        },
      };
      let output: any;
      output = handleChange(event as any);
      expect(v.isValid).toBe(true);
      expect(output).toBe('bob ross')
    });
  });

  describe('validationErrors', () => {
    it('returns an empty array', () => {
      const v = new Validation(schema);
      expect(v.validationErrors).toStrictEqual([]);
    });

    it('returns an array of all errors', () => {
      const v = new Validation(schema);
      v.validateAll(failingState);
      expect(v.validationErrors).toStrictEqual([
        'Cannot be bob.',
        'Must be 18.'
      ])
    });
  });

});
