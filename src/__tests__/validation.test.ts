import { renderHook, act } from '@testing-library/react-hooks';
import { useValidation, ValidationSchema } from 'validation/validation.hook';

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
      errorMessage: 'Must be 18',
      validation: (val: number) => val >= 18,
    }
  ]
};

const defaultState = {
  dingo: false,
};

describe('useValidation tests', () => {

  it('should be defined', () => {
    expect(useValidation).toBeDefined();
  });

  it('renders the hook correctly and checks types', () => {
    const { result } = renderHook(() => useValidation(schema));
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

  describe('getError', () => {
    it('returns an empty string by default', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getError('name');
      expect(output).toBe('');
    });

    it('returns an empty string if the property does not exist', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getError('balls');
      expect(output).toBe('');
    });

    it('retrieves an error message', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'name';
      const value = '';
      const state = defaultState;
      act(() => {
        result.current.validate(name, value, state);
      });
      const output = result.current.getError('name');
      expect(output).toBe('Name is required.');
    });
  });

  describe('getFieldValid', () => {
    it('returns true by default', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getFieldValid('name');
      expect(output).toBe(true);
    });

    it('returns true if the property does not exist', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getFieldValid('balls');
      expect(output).toBe(true);
    });

    it('retrieves an invalid state', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'name';
      const value = '';
      const state = defaultState;
      act(() => {
        result.current.validate(name, value, state);
      });
      const output = result.current.getFieldValid('name');
      expect(output).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true by default', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.isValid;
      expect(output).toBe(true);
    });

    it('changes to false after a validation fails', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'name';
      const value = 'bob';
      const state = defaultState;
      act(() => {
        result.current.validate(name, value, state);
      });
      const output = result.current.isValid;
      expect(output).toBe(false);
    });

    it('changes to true after a failed validation passes', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'name';
      const value = 'bob';
      const state = defaultState;
      act(() => {
        result.current.validate(name, value, state);
        result.current.validate(name, 'bob ross', state);
      });
      const output = result.current.isValid;
      expect(output).toBe(true);
    });
  });

  describe('validate', () => {
    it('returns a boolean if key exists', () => {
      const { result } = renderHook(() => useValidation(schema));
      let output: boolean | undefined;
      const name = 'name';
      const value = 'bob';
      const state = defaultState;
      act(() => {
        output = result.current.validate(name, value, state);
      });
      expect(typeof output).toBe('boolean');
    });

    it('returns undefined if key does not exist', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'balls';
      const value = 'bob';
      const state = defaultState;
      let output: boolean | undefined;
      act(() => {
        output = result.current.validate(name, value, state);
      });
      expect(typeof output).toBe('undefined');
    });

    it('updates the validationState when validation fails', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'name';
      const value = 'chuck';
      const state = { dingo: true };
      act(() => {
        result.current.validate(name, value, state);
      });
      expect(result.current.isValid).toBe(false);
      expect(result.current.getError('name')).toBe('Must be dingo.');
    });

  });

});
