export const doggieValidation = {
  name: [
    {
      errorMessage: 'Cannot be Bob.',
      validation: (val: string, state: any) => {
        return val.toLowerCase() !== 'bob';
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
}
