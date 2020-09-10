import {useValidation} from 'validation.hook';
import {Person, Dog} from 'types';
import {isEqual, trimAndLower } from 'util/utilities';
import {DogValidation} from './Dog.validation';
import {all, map} from 'ramda';

export const PersonValidation = () => {

  const { validateAll: validateDog } = DogValidation();

  return useValidation<Person>({
    name: [
      {
        errorMessage: 'Must be Bob Ross.',
        validation: (val: string, state: any) => {
          return isEqual(trimAndLower(val), 'bob ross');
        }
      },
      {
        errorMessage: 'Name is required.',
        validation: (val: string, state: any) => {
          return val.trim().length > 0;
        }
      },
    ],
    age: [
      {
        errorMessage: 'Cannot be boomer.',
        validation: (val: number, state: any) => {
          return val < 50;
        }
      },
    ],
    dog: [
      {
        errorMessage: 'All Dogs must be valid.',
        validation: (val: Dog[], state: any) => {
          return all(
            isEqual(true),
            map(validateDog, val)
          );
        }
      }
    ]
  });
};
