import React, { useState, FC } from 'react';
import {mergeDeepRight} from 'ramda';
import {Dog} from 'types';
import {DogValidation} from 'examples/validationSchemas/Dog.validation';

export const Example2: FC = () => {

  const [state, setState] = useState<Dog>({
    name: '',
    breed: '',
  });

  const v = DogValidation();

  const validateTogether = (name: string, data: any) => {
    const properties = ['name', 'breed'];
    properties.includes(name) && v.validateAll(data, properties);
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
      <button>Submit</button>
    </form>
  );
}
