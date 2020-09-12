# De-Formed Validations
De-Formed Validations is an unopinionated library to manage validations in [React](https://reactjs.org/).

The goal of de-formed is to provide straight forward, clean, and clear syntax while implementing all the functionality needed to handle both simple and complex validations. With de-formed, just define as many functions as you find necessary, and then execute them on whichever events you choose. Very little attempt has been made to abstract the implementation of this library from the developer giving it a function-based, Lego-like approach to design validation patterns that meet your requirements.

De-Formed takes a simple schema definition and then provides you with a React Hook containing various objects and functions that can be imported anywhere, as needed, to handle validation related tasks. Developers can design the validation behavior catered to their specific needs without having to worry about managing the validation data themselves.

## Why use De-Formed?
1) Maintain separation between form logic, presentation logic, and validation logic.
2) Customize validation behavior with ease in contextual and dynamic situations.
3) Lego-style approach makes reusing and nested validations a snap.
4) Light-weight and easy to test.

## Usage
### Step 1: Create a file to define your validations. 
To avoid unnecessary complexity, use the property names of the object you want to validate for the schema property names. Validation functions can receive an optional second parameter of state if needed.

```ts
export const DogValidation = () => {
  return useValidation<Dog>({
    name: [
      {
        errorMessage: 'Cannot be Bob.',
        validation: (val: string) => val.toLowerCase() !== 'bob',
      },
      {
        errorMessage: 'Name is required.',
        validation: (val: string) => val.length > 0,
      },
    ],
    breed: [
      {
        errorMessage: 'Cannot be Ross if name is Bob.',
        validation: (val: string, state: Dog) => {
          return state.name.toLowerCase() === 'bob'
            ? val.toLowerCase() === 'ross'
            : true;
        }
      },
      {
        errorMessage: 'Breed is required.',
        validation: (val: string) => val.length > 0,
      },
    ]
  });
};
```
## Step 2: Plug and Play
```tsx
export const DogForm = ({ state, onChange }) => {
  const v = DogValidation();

  const handleChange = v.validateOnChange(onChange, state);
  const handleBlur = v.validateOnBlur(state);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const canSubmit = v.validateAll(state);
    console.log('canSubmit', canSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          name="name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={state.name}
        />
        {v.getError('name') && <p>{v.getError('name')}</p>}
      </div>
      <div>
        <label>Breed</label>
        <input
          name="breed"
          onBlur={handleBlur}
          onChange={handleChange}
          value={state.breed}
        />
        {v.getError('breed') && <p>{v.getError('breed')}</p>}
      </div>
      <button disabled={!v.isValid}>Submit</button>
    </form>
  );
};
```
## Documentation
Check out our [documentation](https://github.com/prescottbreeden/de-formed/wiki/Docs) in full.

## Examples
More [examples](https://github.com/prescottbreeden/de-formed/wiki/Examples) and CodeSandboxes.

## License
This project is licensed under the terms of the [MIT license](/LICENSE).

## Future Features:
- class-based version for projects that are unable to implement a hook
- yup integration maybe
