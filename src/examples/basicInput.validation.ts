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
