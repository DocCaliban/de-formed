import React, {Component} from 'react';
import Validation from 'validation';
import {Dog} from 'examples/types';

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
    this.onChange.bind(this);
    this.handleChange.bind(this);
    this.handleBlur.bind(this);
    this.handleSubmit.bind(this);
  }
  v = new Validation<Dog>({
    name: [
      {
        errorMessage: 'Cannot be Bob.',
        validation: (val: string, state: any) => {
          return val.toLowerCase() === 'bob';
        }
      },
      {
        errorMessage: 'Cannot be Ross.',
        validation: (val: string, state: any) => {
          return val.toLowerCase() !== 'ross';
        }
      },
      {
        errorMessage: 'Name is required.',
        validation: (val: string, state: any) => {
          return val.length > 0;
        }
      },
    ],
    breed: [
      {
        errorMessage: 'Must be a Leonberger.',
        validation: (val: string, state: any) => {
          return val.toLowerCase() === 'leonberger';
        }
      },
      {
        errorMessage: 'Breed is required.',
        validation: (val: string, state: any) => {
          return val.length > 0;
        }
      },
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
    this.forceUpdate();
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
