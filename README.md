# De-Formed Validations
De-Formed Validations is an unopinionated library to manage validations in [React](https://reactjs.org/).

The goal of de-formed is to provide straight forward, 
clean, and clear syntax while implementing all the functionality needed to handle both simple and complex validation requirements.  Very little attempt has been 
made to abstract the implementation of this library from the developer giving it a function-based, Lego-like approach to design validation patterns that meet your 
requirements. In fact, only 2 helper functions are unavailble to the API providing as little abstraction as possible.

De-Formed takes a simple schema definition and then provides you with a React Hook containing various objects and functions that can be imported anywhere, as
needed, to handle validation related tasks. Developers can design the validation behavior catered to their specific needs without having to worry about managing 
the validation data themselves.

## Why use De-Formed?
1) Maintain separation between form logic, presentation logic, and validation logic.
2) Let your architecture be guided by you and not your form library. 
3) Customize validation behavior with ease in contextual situations.
4) Lego-style approach makes reusing and nesting validations a snap.
5) Light-weight and easy to test.

## Usage
### Step 1: Create a file to define your validations. 
To avoid unnecessary complexity, use the property names of the object you want to validate for the schema property names. Validation functions can receive an
optional second parameter of state if needed.

```ts
import {useValidation} from 'validation.hook';
import {Dog} from 'types';

export const DogValidation = () => {
  return useValidation<Dog>({
    name: [
      {
        errorMessage: 'Cannot be Bob.',
        validation: (val: string) => val.toLowerCase() !== 'bob',
      },
      {
        errorMessage: 'Name is required.',
        validation: (val: string) => val.length > 0,
      },
    ],
    breed: [
      {
        errorMessage: 'Cannot be Ross if name is Bob.',
        validation: (val: string, state: Dog) => {
          return state.name.toLowerCase() === 'bob'
            ? val.toLowerCase() === 'ross'
            : true;
        }
      },
      {
        errorMessage: 'Breed is required.',
        validation: (val: string) => val.length > 0,
      },
    ]
  });
};
```
## Step 2: Plug and Play
```tsx
import React, { useState, FC } from 'react';
import { Dog } from 'types';
import { DogValidation } from 'examples/validationSchemas/Dog.validation';

export const Example1: FC = () => {

  const [state, setState] = useState<Dog>({
    name: '',
    breed: '',
  });

  const v = DogValidation();

  const onChange = (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    setState({ ...state, ...data });
  };

  const handleChange = v.validateOnChange(onChange, state);
  const handleBlur = v.validateOnBlur(state);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const canSubmit = v.validateAll(state);
    console.log('canSubmit', canSubmit);
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
};
```
## Available API Options: 
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
## License
This project is licensed under the terms of the [MIT license](/LICENSE).
## Future Features:
- class-based version for projects that are unable to implement a hook
- yup integration maybe
