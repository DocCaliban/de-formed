import React, { useState, FC } from 'react';
import {Dog, Person, emptyPerson, } from 'types';
import {PersonValidation} from '../validationSchemas/Person.validation';
import {DogForm} from './DogForm';
import {upsertItem} from 'util/utilities';

export const Example3: FC = () => {

  const [state, setState] = useState<Person>(emptyPerson());
  const [submitting, setSubmitting] = useState<boolean>(false);

  const {
    validateAll,
    validateOnBlur,
    validateOnChange,
    getError,
    isValid,
  } = PersonValidation();

  const onPersonChange = (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    setState({ ...state, ...data });
  };
  const handlePersonChange = validateOnChange(onPersonChange, state);
  const handlePersonBlur = validateOnBlur(state);

  const handleDogChange = (index: number) => (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    const dog = upsertItem<Dog>(state.dog, data, index);
    setState({...state, dog });
  };

  const handleSubmit = (e: any) => {
    setSubmitting(true);
    e.preventDefault();
    const canSubmit = validateAll(state);
    console.log('canSubmit', canSubmit);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          name="name"
          onBlur={handlePersonBlur}
          onChange={handlePersonChange}
          value={state.name}
        />
        {getError('name') && <p>{getError('name')}</p>}
      </div>
      <div>
        <label>Age</label>
        <input
          name="age"
          onBlur={handlePersonBlur}
          onChange={handlePersonChange}
          value={state.age}
        />
        {getError('age') && <p>{getError('age')}</p>}
      </div>
      {state.dog.map((dog: Dog, index: number) => (
        <DogForm
          dog={dog}
          onChange={handleDogChange(index)}
          onSubmit={submitting}
        />
      ))}
      <button disabled={!isValid}>Submit</button>
    </form>
  );
}
