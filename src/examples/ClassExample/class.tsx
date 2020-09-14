import React, { Component } from 'react';
import { Dog } from 'examples/types';
import { doggieValidation } from './classSchema';
import Validation from 'validation/ValidationState';

export class ClassExample extends Component {
  state: {
    name: string;
    breed: string;
  };
  constructor(props: any) {
    super(props);
    this.state = {
      name: '',
      breed: '',
    };
    this.onChange.bind(this);
    this.handleChange.bind(this);
    this.handleBlur.bind(this);
    this.handleSubmit.bind(this);
  }
  v = new Validation<Dog>({ ...doggieValidation });

  onChange = (event: any) => {
    const { value, name } = event.target;
    const data = { [name]: value };
    this.setState({ ...this.state, ...data });
  };

  handleChange = this.v.validateOnChange(this.onChange, this.state);
  handleBlur = this.v.validateOnBlur(this.state);

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.v.validateAll(this.state);
    this.forceUpdate();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Name</label>
          <input
            name="name"
            onBlur={(e: any) => {
              this.handleBlur(e);
              this.forceUpdate();
            }}
            onChange={this.handleChange}
            value={this.state.name}
          />
          {this.v.getError('name') && <p>{this.v.getError('name')}</p>}
        </div>
        <div>
          <label>Breed</label>
          <input
            name="breed"
            onBlur={(e: any) => {
              this.handleBlur(e);
              this.forceUpdate();
            }}
            onChange={this.handleChange}
            value={this.state.breed}
          />
          {this.v.getError('breed') && <p>{this.v.getError('breed')}</p>}
        </div>
        <button>Submit</button>
      </form>
    );
  }
}
