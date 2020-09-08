Create a file to define your validations:
```ts
import {useValidation} from 'validation.hook';

export interface Dog {
  name: string;
  breed: string;
}

export const BasicInputValidation = () => {
  return useValidation<Dog>({
    name: [
      {
        errorMessage: 'Cannot be Bob.',
        validation: (val: string, state: any) => {
          return val.trim().toLowerCase() !== 'bob';
        }
      },
      {
        errorMessage: 'Cannot be Ross.',
        validation: (val: string, state: any) => {
          return val.trim().toLowerCase() !== 'ross';
        }
      },
      {
        errorMessage: 'Name is required.',
        validation: (val: string, state: any) => {
          return val.trim().length > 0;
        }
      },
    ],
    breed: [
      {
        errorMessage: 'Must be a Leonberger.',
        validation: (val: string, state: any) => {
          return val.trim().toLowerCase() === 'leonberger';
        }
      },
      {
        errorMessage: 'Breed is required.',
        validation: (val: string, state: any) => {
          return val.trim().length > 0;
        }
      },
    ]
  });
};
```
Wherever you need to validate an input, just import the function and grab whatever you want off the hook's output:
```tsx
const {
  getError,
  getFieldValid,
  validate,
  validateIfTrue,
  validateAll
} = BasicInputValidation();

return (
  <>
    <h3>Dog</h3>
    <label>Name</label>
    <input
      key="name"
      onBlur={() => validate('name', state.name, state)}
      onChange={onChange('name')}
      type="text" 
      value={state.name}
    />
    <p style={{ color: 'red' }}>{getError('name')}</p>
  </>
);
```
Available API options: 
```
getError          --> current error message for a field
getFieldValid     --> returns whether a specific field is valid
isValid           --> boolean that represents if all fields in hook valid
validate          --> function that validates a single field
validateAll       --> function that validates all keys in hook
validateIfTrue    --> function that updates hook if the validation passes (useful for onChange events)
validationErrors  --> list of active validation errors
validationState   --> object that contains isValid and errorMessage for each field
```
