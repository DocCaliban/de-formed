De-formed is an unopinionated library to manage validations.  Validations and form libraries are simply far too complicated for something that should be extremely simple and straight forward, which is the goal of de-formed.  

De-formed will take a simple schema definition, and then provide you with a React Hook that can be imported anywhere, as needed, to handle validation related tasks. Developers can design their own validation behavior catered to their specific needs without having to worry about managing the validation data themselves.

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
          return !isEqual(trimAndLower(val), 'bob');
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
        errorMessage: 'Cannot be Ross if name is Bob.',
        validation: (val: string, state: any) => {
          return isEqual(trimAndLower(state.name), 'bob')
            ? !isEqual(trimAndLower(val), 'ross')
            : true;
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
Example 1 - Basic Usage:
```tsx
import React, { useState } from 'react';
import {FC} from 'react';
import { BasicInputValidation } from 'examples/basicInput.validation';

export const Example1: FC = () => {

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
    return v.validateAll(state)
      ? console.log('Success, where we are going, we don\'t need roads!')
      : console.log('Validations failed, sad panda...');
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
```
Example 2 - Use case where you might have to always validate two, or more different inputs simultaneously:
```tsx
import React, { useState } from 'react';
import {FC} from 'react';
import { BasicInputValidation } from 'examples/basicInput.validation';
import {mergeDeepRight} from 'ramda';

export const Example2: FC = () => {

  const [state, setState] = useState({
    name: '',
    breed: '',
  });

  const v = BasicInputValidation();

  const validateTogether = (name: string, data: any) => {
    const props = ['name', 'breed'];
    if (props.includes(name)) {
      v.validateAll(data, ['name', 'breed']);
    }
  }

  const handleChange = (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    const updatedState = mergeDeepRight(state, data);
    validateTogether(name, updatedState);
    setState(updatedState);
  }

  const handleBlur = (event: any) => {
    const { name } = event.target;
    validateTogether(name, state);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    return v.validateAll(state)
      ? console.log('Success, where we are going, we don\'t need roads!')
      : console.log('Validations failed, sad panda...');
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
