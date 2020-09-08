import React, { FC } from 'react';
import {ValidationObject} from 'validation.hook';
import {prop } from 'ramda';
import {randomString} from 'util/utilities';

type WrapperProps = {
  name: string;
  label: string;
  onChange?: (event: any) => void;
  state: any;
}

export const InputWrapper = (v: any) => {
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
        <input key={name} id={name} {...modifiedProps} />
        <p style={{ color: 'red' }}>{v.getError(name)}</p>
      </React.Fragment>
    );
  }
  return Wrapper;
}

