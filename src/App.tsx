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
  const handleBlur = v.validateOnBlur(state);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    v.validateAll(state);
  };

  return (
    <div style={{ padding: '10rem' }}>

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

    </div>
  );
}

export default App;
