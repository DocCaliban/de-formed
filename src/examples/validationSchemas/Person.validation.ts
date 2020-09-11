import {useValidation} from 'validation.hook';
import {Person, Dog} from 'types';
import {DogValidation} from './Dog.validation';

export const PersonValidation = () => {
  const { validateAll: validateDog } = DogValidation();
  return useValidation<Person>({
    name: [
      {
        errorMessage: 'Must be Bob Ross.',
        validation: (val: string) => {
          return val.toLowerCase() === 'bob ross';
        }
      },
      {
        errorMessage: 'Name is required.',
        validation: (val: string) => val.length > 0,
      },
    ],
    age: [
      {
        errorMessage: 'Cannot be boomer.',
        validation: (val: number) => val < 50,
      },
      {
        errorMessage: 'Must be at least 18.',
        validation: (val: number) => val >= 18,
      },
    ],
    dog: [
      {
        errorMessage: 'All Dogs must be valid.',
        validation: (dogs: Dog[]) => {
          return dogs.reduce((prev: any, dog: Dog) => validateDog(dog), true);
        }
      }
    ]
  });
};
