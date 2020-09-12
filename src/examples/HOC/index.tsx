import React, { FC, useEffect } from "react";
import { ValidationObject } from "validation/validation.hook";
import { randomString } from "util/utilities";

type WrapperProps = {
  name: string;
  label: string;
  onChange?: (event: any) => void;
  state: any;
};

export const InputWrapper = (v: ValidationObject) => {
  const Wrapper: FC<WrapperProps> = (props) => {
    const { label, onChange, name, state } = props;

    const getPattern = (value: any) => {
      return v.getFieldValid(name) ? `${value}` : `${randomString()}`;
    };

    const modifiedProps = {
      key: name,
      id: name,
      name,
      onBlur: v.validateOnBlur(state),
      onChange: v.validateOnChange(onChange as any, state),
      pattern: getPattern(state[name]),
      value: state[name],
    };

    useEffect(() => {
      if (v) {
        console.log(v.validate('name', state.name, state));
        console.log(v.getError('name'));
      }
    }, [state])

    return (
      <React.Fragment key={1}>
        <label htmlFor={name}>{label}</label>
        <br />
        <input key={name} id={name} {...modifiedProps} />
        <p style={{ color: "red" }}>{v.getError(name)}</p>
      </React.Fragment>
    );
  };
  return Wrapper;
};

