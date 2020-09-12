import React, { useState } from "react";
import { Dog } from "examples/types";
import { DogValidation } from "examples/validationSchemas/Dog.validation";
import { InputWrapper } from "examples/HOC";

export const Example4 = () => {
  const [state, setState] = useState<Dog>({
    name: "",
    breed: ""
  });

  const v = DogValidation();
  const { current: HOC } = React.useRef(InputWrapper(v));

  const onChange = (event: any) => {
    const { name, value } = event.target;
    const data = { [name]: value };
    setState({ ...state, ...data });
  };

  const testValidateAll = () => {
    return v.validateAll(state);
  };

  return (
    <>
      <HOC
        name="name"
        label="Name"
        onChange={onChange}
        state={state} 
      />
      <HOC
        name="breed"
        label="Dog Breed"
        onChange={onChange}
        state={state}
      />
      <button onClick={testValidateAll} disabled={!v.isValid}>
        Submit
      </button>
    </>
  );
}
