import React, { FC } from 'react';
import {ValidationObject} from 'validation.hook';
import {prop} from 'ramda';
import {randomString} from 'util/utilities';

type WrapperProps = {
  name: string;
  onChange?: Function;
  state: any;
}

export function ValidationHOC(WrappedComponent: any) {
  return class HOC extends React.Component {
    state: any = {
      fields: {}
    }
    onChange: Function;
    constructor(props: any) {
      super(props);
      this.state = props.state;
      this.onChange = props.onChange;
    };

    getField(fieldName: string) {
      if (!this.state[fieldName]) {
        this.setState({
          ...this.state,
          [fieldName]: {
            value: '',
            onChange: (event: any) => {
              this.onChange(event);
              this.forceUpdate();
            }
          }
        })
        return {
          value: this.state[fieldName].value,
          onChange: this.state[fieldName].onChange,
        };
      }
    }

    render() {
      const props = Object.assign({}, this.props, {
        fields: this.getField.bind(this),
      })
      return (
        <div>
          <WrappedComponent {...props} />
        </div>
      );
    }
  };
};

export const InputWrapper = (v: ValidationObject) => {
  const Wrapper: FC<WrapperProps> = (props) => {
    const { children, onChange, name, state } = props;

    const getPattern = (value: any) => {
      return v.getFieldValid(name)
        ? `${value}`
        : `${randomString()}`
    };

    return (
      <React.Fragment>
        {React.Children.map(children, (child, i: number) => {
          const props = { 
            name: name,
            onBlur: () => v.validate(name, prop(name, state), state),
            onChange: onChange,
            pattern: getPattern(state[name]),
            value: state[name],
          };
          const ele = React.isValidElement(child)
            ? React.cloneElement(child, props)
            : child;

          console.log(ele);
          return ele;
        })}
        <p style={{ color: 'red' }}>{v.getError(name)}</p>
      </React.Fragment>
    );
  }
  return Wrapper;
}

