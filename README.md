De-formed is an unopinionated library to manage validations in React.  Unfortunately, many form and validation libraries create highly abstract validations with unorthodox syntax, cumbersome schemas, forced architecture choices, and lack of customiziation.  The goal of de-formed is to provide simple and straight forward validation management for React projects.  

De-formed will take a simple schema definition, and then provide you with a React Hook that can be imported anywhere, as needed, to handle validation related tasks. Developers can design their own validation behavior catered to their specific needs without having to worry about managing the validation data themselves.

Much of the time, Example 1 (see below) will be all you need, however, de-formed also makes it easy to:

1) Maintain separation between form/presentation logic and validation logic (see Example 1)
2) Create asymetrical validations (where validations might occur depending on highly contextual situations, see Example 2)
3) Reuse and nest validation logic (see Example 3)
4) Customize how you want validations to respond to events without restriction 

Step 1: Create a file to define your validations:

```ts
import { useValidation } from 'validation.hook';
import { isEqual, trimAndLower } from 'util/utilities';
import { Dog } from 'types';

export const BasicInputValidation = () => {
  return useValidation<Dog>({
   name: [
      {
        errorMessage: 'Cannot be Bob.',
        validation: (val: string, state: any) => {
          return val.trim() !== 'bob';
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
          return state.name.trim() === 'bob'
            ? val.trim() !== 'ross'
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
Step 2: Plug and Play

Example 1: Basic Usage
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
Example 2: Asymetrical validation
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
Example 3: Nested Forms

Nested Validation Schema: (ramda is not required, the dog validation is just mapping over the array and determining if they're all true)
```tsx
import { useValidation } from 'validation.hook';
import { Person, Dog } from 'types';
import { isEqual, trimAndLower } from 'util/utilities';
import { DogValidation } from './Dog.validation';
import { all, map } from 'ramda';

export const PersonValidation = () => {

  const { validateAll: validateDog } = DogValidation();

  return useValidation<Person>({
    name: [
      {
        errorMessage: 'Must be Bob Ross.',
        validation: (val: string, state: any) => {
          return isEqual(trimAndLower(val), 'bob ross');
        }
      },
      {
        errorMessage: 'Name is required.',
        validation: (val: string, state: any) => {
          return val.trim().length > 0;
        }
      },
    ],
    age: [
      {
        errorMessage: 'Cannot be boomer.',
        validation: (val: number, state: any) => {
          return val < 50;
        }
      },
    ],
    dog: [
      {
        errorMessage: 'All Dogs must be valid.',
        validation: (val: Dog[], state: any) => {
          return all(
            isEqual(true),
            map(validateDog, val)
          );
        }
      }
    ]
  });
};
```
Top Level Form:
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
Nested Form Element:
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
