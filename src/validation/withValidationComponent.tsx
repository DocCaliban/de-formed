import React from 'react';
import {ValidationObject} from 'validation/validation.hook';
import {randomString, prop} from 'util/utilities';

type WrapperProps<S> = {
  name: keyof S;
  label: string;
  onChange?: (event: any) => void;
  state: any;
}

export function InputWrapper<S>(v: ValidationObject<S>) {
  return function Wrapper(props: WrapperProps<S>) {
    const { label, onChange, name, state } = props;

    const getPattern = (value: any) => {
      return v.getFieldValid(name)
        ? `${value}`
        : `${randomString()}`
    };

    const modifiedProps = { 
      name: name as string,
      onBlur: () => v.validate(name, prop(name, state), state),
      onChange,
      pattern: getPattern(state[name]),
      value: state[name],
    };

    return (
      <React.Fragment>
        <label htmlFor={name as string}>{label}</label>
        <br />
        <input key={name as string} id={name as string} {...modifiedProps} />
        <p style={{ color: 'red' }}>{v.getError(name)}</p>
      </React.Fragment>
    );
  }
}

