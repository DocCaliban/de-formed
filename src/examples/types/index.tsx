export interface Person {
  name: string;
  age: number;
  dog: Dog[];
}

export interface Dog {
  name: string;
  breed: string;
}

export const emptyPerson = () => {
  return {
    name: '',
    age: 0,
    dog: [
      {
        name: '',
        breed: ''
      },
      {
        name: '',
        breed: ''
      }
    ],
  }
}
