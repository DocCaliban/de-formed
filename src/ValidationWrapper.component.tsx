import React, { FC, ReactElement} from 'react';
import {ValidationObject} from 'validation.hook';
import {prop} from 'ramda';
import {randomString} from 'util/utilities';

type WrapperProps = {
  name: string;
  onChange?: Function;
  state: any;
  element: ReactElement;
}

export const InputWrapper = (v: ValidationObject) => {
  const Wrapper: FC<WrapperProps> = (props) => {
    const { element, onChange, name, state } = props;
    const input = element;

    const getPattern = (value: any) => {
      return v.getFieldValid(name)
        ? `${value}`
        : `${randomString()}`
    };

    const cloneProps = { 
      key: randomString(),
      name: name,
      onBlur: () => v.validate(name, prop(name, state), state),
      onChange: onChange,
      pattern: getPattern(state[name]),
      value: state[name],
    };

    const clone = React.isValidElement(input)
      ? React.cloneElement(input, cloneProps)
      : element;

    return (
      <React.Fragment>
        {clone}
        <p style={{ color: 'red' }}>{v.getError(name)}</p>
      </React.Fragment>
    );
  }
  return Wrapper;
}

