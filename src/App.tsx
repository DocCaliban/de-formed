import React, { useState } from 'react';
import { BasicInputValidation } from 'examples/basicInput.validation';

function App() {
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    v.validateAll(state);
  };

  return (
    <div style={{ padding: '10rem' }}>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            onBlur={() => v.validate('name', state.name, state)}
            onChange={handleChange}
            type="text"
            value={state.name}
          />
          {v.getError('name') && <p>{v.getError('name')}</p>}
        </div>
        <div>
          <label htmlFor="breed">Breed</label>
          <input
            id="breed"
            name="breed"
            onBlur={() => v.validate('breed', state.breed, state)}
            onChange={handleChange}
            type="text"
            value={state.breed}
          />
          {v.getError('breed') && <p>{v.getError('breed')}</p>}
        </div>
        <button disabled={!v.isValid}>Submit</button>
      </form>

    </div>
  );
}

export default App;
