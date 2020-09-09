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
Example Usage:
```tsx
import React, { useState } from 'react';
import { BasicInputValidation } from 'examples/basicInput.validation';

function App() {
  const [state, setState] = useState({
    name: '',
    breed: '',
  });

  const v = BasicInputValidation();

  const onChange = (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    setState({ ...state, ...data });
  };

  const handleChange = v.validateOnChange(onChange, state);
  const handleBlur = v.validateOnBlur(state);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    v.validateAll(state);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          name="name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={state.name}
        />
        {v.getError('name') && <p>{v.getError('name')}</p>}
      </div>
      <div>
        <label>Breed</label>
        <input
          name="breed"
          onBlur={handleBlur}
          onChange={handleChange}
          value={state.breed}
        />
        {v.getError('breed') && <p>{v.getError('breed')}</p>}
      </div>
      <button disabled={!v.isValid}>Submit</button>
    </form>
  );
}

export default App;

```
Available API options: 
```
getError          --> current error message for a field
getFieldValid     --> returns whether a specific field is valid
isValid           --> boolean that represents if all fields in hook valid
validate          --> function that validates a single field
validateAll       --> function that validates all keys in hook
validateIfTrue    --> function that updates hook if the validation passes (useful for onChange events)
validateOnBlur    --> function that returns a new function which will update the validation state
validateOnChange  --> function that returns a new function which will update the validation state
validationErrors  --> list of active validation errors
validationState   --> object that contains isValid and errorMessage for each field
```
