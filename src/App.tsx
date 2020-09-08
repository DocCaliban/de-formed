import React, { useState } from 'react';
import {BasicInputValidation, Dog} from 'examples/basicInput.validation';
import {Input} from 'Input.component';

function App() {
  const [state, setState] = useState<Dog>({
    name: '',
    breed: '',
  });

  const v = BasicInputValidation();

  const onChange = (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    v.validateIfTrue(name, value, state);
    setState({ ...state, ...data });
  };

  const testValidateAll = () => {
    return v.validateAll(state);
  };

  return (
    <div style={{ padding: '10rem' }}>
      <Input 
        label="Name"
        name="name"
        onChange={onChange}
        state={state}
        v={v}
      />
      <Input
        label="Dog Breed"
        name="breed"
        onChange={onChange}
        state={state}
        v={v}
      />
      <button onClick={testValidateAll} disabled={!v.isValid}>
        Submit
      </button>
    </div>
  );
}

export default App;
