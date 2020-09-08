import React, { useState } from 'react';
import {BasicInputValidation} from 'examples/basicInput.validation';
import {InputWrapper} from 'withValidationComponent';
import { curry } from 'ramda';

function App() {
  const [state, setState] = useState<{name: string}>({ name: '' });

  const onChange = curry((name: string, event: any) => {
    const data = { [name]: event.target.value }
    setState({ ...state, ...data });
  })

  const v = BasicInputValidation();
  const HOC = InputWrapper(v);

  return (
    <>
      <HOC 
        name="name"
        label="Name"
        onChange={onChange('name')}
        state={state}
      />
    </>
  );
}

export default App;
