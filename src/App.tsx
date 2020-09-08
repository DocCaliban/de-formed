import React, { useState } from 'react';
import {BasicInputValidation, Dog} from 'examples/basicInput.validation';
import {handleChange, randomString } from 'util/utilities';

function App() {
  const [state, setState] = useState<Dog>({
    name: '',
    breed: '',
  });

  const styles = {
    position: 'absolute',
    width: '100%',
    display: 'block',
    padding: '10rem'
  };

  const {
    getError,
    getFieldValid,
    validate,
    validateIfTrue,
    validateAll
  } = BasicInputValidation();

  const onChange = handleChange((data: any, key: string, value: any) => {
    validateIfTrue(key, value, state);
    setState({ ...state, ...data });
  });

  const getPattern = (key: string, state: any) => {
    return getFieldValid(key)
      ? `${state[key]}`
      : `${randomString()}`
  };

  return (
    <>
      <div style={styles as any}>
        <h3>Dog</h3>

        <label>Name</label>
        <br />
        <input
          key="name"
          onBlur={() => validate('name', state.name, state)}
          onChange={onChange('name')}
          pattern={getPattern('name', state)}
          type="text" 
          value={state.name}
        />
        <p style={{ color: 'red' }}>{getError('name')}</p>

        <label>Breed</label>
        <br />
        <input 
          key="breed"
          onBlur={() => validate('breed', state.breed, state)}
          onChange={onChange('breed')}
          pattern={getPattern('breed', state)}
          type="text" 
          value={state.breed}
        />
        <p style={{ color: 'red' }}>{getError('breed')}</p>

        <button onClick={() => validateAll(state)}>
          Validate All
        </button>
      </div>
    </>
  );
}

export default App;
