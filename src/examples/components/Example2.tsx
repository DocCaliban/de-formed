import React, {Component} from 'react';
import Validation from 'validation';
import {Dog} from 'examples/basicInput.validation';

export class Example2 extends Component {
  state: {
    name: string;
    breed: string;
  }
  constructor(props: any) {
    super(props);
    this.state = {
      name: '',
      breed: '',
    };
  }
  v = new Validation<Dog>({
    name: [
      {
        errorMessage: 'Name is required',
        validation: (val: any, state: any) => !!val.trim(),
      }
    ],
    breed: [
      {
        errorMessage: 'Breed is required',
        validation: (val: any, state: any) => !!val.trim(),
      }
    ]
  });

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
  };

  render() {
    return (
      <div style={{ padding: '10rem' }}>

        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Name</label>
            <input
              name="name"
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              value={this.state.name}
            />
            {this.v.getError('name') && <p>{this.v.getError('name')}</p>}
          </div>
          <div>
            <label>Breed</label>
            <input
              name="breed"
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              value={this.state.breed}
            />
            {this.v.getError('breed') && <p>{this.v.getError('breed')}</p>}
          </div>
          <button disabled={!this.v.isValid}>Submit</button>
        </form>

      </div>
    );
  }
}
