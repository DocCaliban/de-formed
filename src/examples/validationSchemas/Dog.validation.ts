import {useValidation} from 'validation.hook';
import {isEqual, trimAndLower } from 'util/utilities';
import {Dog} from 'types';

export const DogValidation = () => {
  return useValidation<Dog>({
    name: [
      {
        errorMessage: 'Cannot be Bob.',
        validation: (val: string, state: any) => {
          return !isEqual(trimAndLower(val), 'bob');
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
        errorMessage: 'Cannot be Ross if name is Bob.',
        validation: (val: string, state: any) => {
          return isEqual(trimAndLower(state.name), 'bob')
            ? !isEqual(trimAndLower(val), 'ross')
            : true;
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
