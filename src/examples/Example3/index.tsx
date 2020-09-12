import React, { useState, FC } from 'react';
import {Dog, Person, emptyPerson, } from 'examples/types';
import {PersonValidation} from 'examples/validationSchemas/Person.validation';
import {DogForm} from './DogForm';
import {upsertItem} from 'util/utilities';

export const Example3: FC = () => {

  const [state, setState] = useState<Person>(emptyPerson());
  const [runValidations, setRunValidations] = useState<boolean>(false);

  const {
    validateAll,
    validateOnBlur,
    validateOnChange,
    getError,
  } = PersonValidation();

  const onPersonChange = (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    setState({ ...state, ...data });
  };
  const handleOnChange = validateOnChange(onPersonChange, state);
  const handleOnBlur = validateOnBlur(state);

  const handleDogChange = (index: number) => (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    const dog = upsertItem<Dog>(state.dog, data, index);
    setState({ ...state, dog });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setRunValidations(!runValidations); // force children to run validations
    const canSubmit = validateAll(state);
    console.log('canSubmit', canSubmit);
  };

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
}
