import React, { useState, FC } from 'react';
import {Dog, Person, emptyPerson, } from 'types';
import {PersonValidation} from '../validationSchemas/Person.validation';
import {DogForm} from './DogForm';
import {upsertItem} from 'util/utilities';

export const Example3: FC = () => {

  const [state, setState] = useState<Person>(emptyPerson());
  const [submitting, setSubmitting] = useState<boolean>(false);

  const {
    validateAll: validatePerson,
    validateOnBlur: validatePersonBlur,
    validateOnChange: validatePersonChange,
    getError: getPersonError,
    isValid: isPersonValid,
  } = PersonValidation();

  const onPersonChange = (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    setState({ ...state, ...data });
  };
  const handlePersonChange = validatePersonChange(onPersonChange, state);
  const handlePersonBlur = validatePersonBlur(state);

  const handleDogChange = (index: number) => (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    const dog = upsertItem<Dog>(state.dog, data, index);
    setState({...state, dog });
  };

  const handleSubmit = (e: any) => {
    setSubmitting(true);
    e.preventDefault();
    validatePerson(state)
      ? console.log('Success, where we are going, we don\'t need roads!')
      : console.log('Validations failed, sad panda...');
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
        {getPersonError('name') && <p>{getPersonError('name')}</p>}
      </div>
      <div>
        <label>Age</label>
        <input
          name="age"
          onBlur={handlePersonBlur}
          onChange={handlePersonChange}
          value={state.age}
        />
        {getPersonError('age') && <p>{getPersonError('age')}</p>}
      </div>
      {state.dog.map((dog: Dog, index: number) => (
        <DogForm
          dog={dog}
          onChange={handleDogChange(index)}
          onSubmit={submitting}
        />
      ))}
      <button disabled={!isPersonValid}>Submit</button>
    </form>
  );
}
