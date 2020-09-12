import React, { FC } from 'react';
import { ValidationObject } from 'validation/validation.hook';
import { randomString } from 'util/utilities';

type InputProps = {
  disabled?: boolean;
  label: string;
  name: string;
  onChange?: (event: any) => any;
  state: any;
  type?: string;
  v?: ValidationObject;
}

export const Input: FC<InputProps> = (props) => {
  const { label, onChange, name, state, type, v } = props;

  if (v) {
    const getPattern = (value: any) => {
      return v.getFieldValid(name)
        ? `${value}`
        : `${randomString()}`
    };

    const validationProps = { 
      key: name,
      id: name,
      name,
      onBlur: v.validateOnBlur(state),
      onChange: v.validateOnChange(onChange as any, state),
      pattern: getPattern(state[name]),
      value: state[name],
      type: type,
    };

    return (
      <React.Fragment>
        <label htmlFor={name}>{label}</label>
        <br />
        <input {...validationProps} />
        <p style={{ color: 'red' }}>{v.getError(name)}</p>
      </React.Fragment>
    );
  }

  const nonValidationProps = { 
    key: name,
    id: name,
    name,
    onChange,
    value: state[name],
    type: type,
  };
  return (
    <React.Fragment>
      <label htmlFor={name}>{label}</label>
      <br />
      <input {...nonValidationProps} />
    </React.Fragment>
  );
};
