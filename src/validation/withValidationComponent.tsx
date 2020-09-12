import React, { FC } from 'react';
import {ValidationObject} from 'validation/validation.hook';
import {randomString, prop} from 'util/utilities';

type WrapperProps = {
  name: string;
  label: string;
  onChange?: (event: any) => void;
  state: any;
}

export const InputWrapper = (v: ValidationObject) => {
  const Wrapper: FC<WrapperProps> = (props) => {
    const { label, onChange, name, state } = props;

    const getPattern = (value: any) => {
      return v.getFieldValid(name)
        ? `${value}`
        : `${randomString()}`
    };

    const modifiedProps = { 
      name,
      onBlur: () => v.validate(name, prop(name, state), state),
      onChange,
      pattern: getPattern(state[name]),
      value: state[name],
    };

    return (
      <React.Fragment>
        <label htmlFor={name}>{label}</label>
        <br />
        <input key={name} id={name} {...modifiedProps} />
        <p style={{ color: 'red' }}>{v.getError(name)}</p>
      </React.Fragment>
    );
  }
  return Wrapper;
}

