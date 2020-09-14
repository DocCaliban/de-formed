import React from 'react';
import { randomString, prop } from 'util/utilities';
import { ValidationObject } from 'types';

type InputProps<S> = {
  disabled?: boolean;
  label: string;
  name: keyof S;
  onChange?: (event: any) => void;
  state: any;
  type?: string;
  v?: ValidationObject<S>;
};

export function Input<S>(props: InputProps<S>) {
  const { label, onChange, name, state, type, v } = props;

  if (v) {
    const getPattern = (value: any) => {
      return v.getFieldValid(name) ? `${value}` : `${randomString()}`;
    };

    const validationProps = {
      key: name as string,
      id: name as string,
      name: name as string,
      onBlur: () => v.validate(name, prop(name, state), state),
      onChange,
      pattern: getPattern(state[name]),
      value: state[name],
      type: type,
    };

    return (
      <React.Fragment>
        <label htmlFor={name as string}>{label}</label>
        <br />
        <input {...validationProps} />
        <p style={{ color: 'red' }}>{v.getError(name)}</p>
      </React.Fragment>
    );
  }

  const nonValidationProps = {
    key: name as string,
    id: name as string,
    name: name as string,
    onChange,
    value: state[name],
    type: type,
  };
  return (
    <React.Fragment>
      <label htmlFor={name as string}>{label}</label>
      <br />
      <input {...nonValidationProps} />
    </React.Fragment>
  );
}
