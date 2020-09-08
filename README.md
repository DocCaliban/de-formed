Create a file to define your validations:
```
import {useValidation} from 'validation.hook';

export interface Dog {
  name: string;
  breed: string;
}

export const BasicInputValidation = () => {
  return useValidation<Dog>({
    name: [
      {
        errorMessage: 'Cannot be Bob.',
        validation: (val: string, state: any) => {
          return val.trim().toLowerCase() !== 'bob';
        }
      },
      {
        errorMessage: 'Cannot be Ross.',
        validation: (val: string, state: any) => {
          return val.trim().toLowerCase() !== 'ross';
        }
      },
      {
        errorMessage: 'Name is required.',
        validation: (val: string, state: any) => {
          return val.trim().length > 0;
        }
      },
    ],
    breed: [
      {
        errorMessage: 'Must be a Leonberger.',
        validation: (val: string, state: any) => {
          return val.trim().toLowerCase() === 'leonberger';
        }
      },
      {
        errorMessage: 'Breed is required.',
        validation: (val: string, state: any) => {
          return val.trim().length > 0;
        }
      },
    ]
  });
};
```
Wherever you need to validate an input, just import the function and grab whatever you want off the hook's output:
```
<h3>Dog</h3>

<label>Name</label>
<input
  key="name"
  onBlur={() => validate('name', state.name, state)}
  onChange={onChange('name')}
  type="text" 
  value={state.name}
/>
<p style={{ color: 'red' }}>{getError('name')}</p>
```
