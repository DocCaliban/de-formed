import React, { useState, FC } from 'react';
import { Dog } from 'examples/types';
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
      <button>Submit</button>
    </form>
  );
};
