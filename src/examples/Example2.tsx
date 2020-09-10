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
