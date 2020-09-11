# De-Formed Validations
De-Formed Validations is an unopinionated library to manage validations in [React](https://reactjs.org/).

The goal of de-formed is to provide straight forward, 
clean, and clear syntax while implementing all the functionality needed to handle both simple and complex validation requirements.  Very little attempt has been 
made to abstract the implementation of this library from the developer giving it a function-based, Lego-like approach to design validation patterns that meet your 
requirements. In fact, only 2 helper functions sit behind the API providing as little abstraction as possible.

De-Formed takes a simple schema definition and then provides you with a React Hook containing various objects and functions that can be imported anywhere, as
needed, to handle validation related tasks. Developers can design the validation behavior catered to their specific needs without having to worry about managing 
the validation data themselves.

## Why use De-Formed?
1) Maintain separation between form logic, presentation logic, and validation logic.
2) Let your architecture be guided by you and not your form library. 
3) Customize validation behavior with ease in contextual situations.
4) Lego-style approach makes reusing and nesting validations a snap.
5) Light-weight.

## Usage
### Step 1: Create a file to define your validations. 
Validation functions can receive an optional second parameter of state if any validations are conditional on other properties in state.  To avoid unnecessary 
complexity, use the property names of the object you want to validate. 

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
        validation: (val: string, state: any) => {
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
## Codependent Validation
```tsx
import React, { useState, FC } from 'react';
import { Dog } from 'types';
import { DogValidation } from 'examples/validationSchemas/Dog.validation';

export const Example2: FC = () => {

  const [state, setState] = useState<Dog>({
    name: '',
    breed: '',
  });

  const v = DogValidation();

  const validateTogether = (name: string, data: any) => {
    const properties = ['name', 'breed'];
    properties.includes(name) && v.validateAll(data, properties);
  };

  const handleChange = (event: any) => {
    { ... }
    validateTogether(name, updatedState);
  };

  const handleBlur = (event: any) => {
    const { name } = event.target;
    validateTogether(name, state);
  };

  const handleSubmit = (e: any) => { ... };

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
      <button>Submit</button>
    </form>
  );
};
```
## Nested Forms

### Nested Validation Schema
```tsx
import {useValidation} from 'validation.hook';
import {Person, Dog} from 'types';
import {DogValidation} from './Dog.validation';

export const PersonValidation = () => {
  const { validateAll: validateDog } = DogValidation();
  return useValidation<Person>({
    name: [
      {
        errorMessage: 'Must be Bob Ross.',
        validation: (val: string) => {
          return val.toLowerCase() === 'bob ross';
        }
      },
      {
        errorMessage: 'Name is required.',
        validation: (val: string) => val.length > 0,
      },
    ],
    age: [
      {
        errorMessage: 'Cannot be boomer.',
        validation: (val: number) => val < 50,
      },
      {
        errorMessage: 'Must be at least 18.',
        validation: (val: number) => val >= 18,
      },
    ],
    dog: [
      {
        errorMessage: 'All Dogs must be valid.',
        validation: (dogs: Dog[]) => {
          return dogs.reduce((prev: any, dog: Dog) => validateDog(dog), true);
        }
      }
    ]
  });
};
```
### Top Level Form:
```tsx
import React, { useState, FC } from 'react';
import { Dog, Person, emptyPerson } from 'types';
import { PersonValidation } from 'examples/validationSchemas/Person.validation';
import { DogForm } from './DogForm';
import { upsertItem } from 'util/utilities';

export const Example3: FC = () => {

  const [state, setState] = useState<Person>(emptyPerson());
  const [runValidations, setRunValidations] = useState<boolean>(false);

  const {
    validateAll,
    validateOnBlur,
    validateOnChange,
    getError,
  } = PersonValidation();

  const onPersonChange = (event: any) => { ... };
  const handleOnChange = validateOnChange(onPersonChange, state);
  const handleOnBlur = validateOnBlur(state);
  const handleDogChange = (index: number) => (event: any) => { ... };
  const handleSubmit = (e: any) => { ... };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          name="name"
          onBlur={handleOnBlur}
          onChange={handleOnChange}
          value={state.name}
        />
        {getError('name') && <p>{getError('name')}</p>}
      </div>
      <div>
        <label>Age</label>
        <input
          name="age"
          onBlur={handleOnBlur}
          onChange={handleOnChange}
          value={state.age}
        />
        {getError('age') && <p>{getError('age')}</p>}
      </div>
      {state.dog.map((dog: Dog, index: number) => (
        <DogForm
          key={index}
          dog={dog}
          onChange={handleDogChange(index)}
          runValidations={runValidations}
        />
      ))}
      <button>Submit</button>
    </form>
  );
};
```
### Nested Form Element:
```tsx
import React, {FC, useEffect} from 'react';
import { Dog } from 'types';
import { DogValidation } from 'examples/validationSchemas/Dog.validation';

type DogFormProps = {
  dog: Dog;
  onChange: (event: any) => any;
  runValidations: boolean;
};

export const DogForm: FC<DogFormProps> = (props) => {

  const { dog, onChange, runValidations } = props;
  const {
    validateOnBlur,
    validateOnChange,
    getError,
    validateAll,
  } = DogValidation();

  const handleDogBlur = validateOnBlur(dog);
  const handleDogChange = validateOnChange(onChange, dog);

  useEffect(() => {
    runValidations && validateAll(dog);
  }, [runValidations]);

  return (
    <>
      <div>
        <label>Dog Name</label>
        <input
          name="name"
          onBlur={handleDogBlur}
          onChange={handleDogChange}
          value={dog.name}
        />
        {getError('name') && <p>{getError('name')}</p>}
      </div>
      <div>
        <label>Breed</label>
        <input
          name="breed"
          onBlur={handleDogBlur}
          onChange={handleDogChange}
          value={dog.breed}
        />
        {getError('breed') && <p>{getError('breed')}</p>}
      </div>
    </>
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
## Future Features:
- validate string detection to auto-trim strings
- class-based version for projects that are unable to implement a hook
- yup integration maybe
