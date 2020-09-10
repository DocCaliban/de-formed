import React, {FC, useEffect} from 'react';
import {Dog} from 'types';
import {DogValidation} from 'examples/validationSchemas/Dog.validation';

type DogFormProps = {
  dog: Dog;
  onChange: (event: any) => any;
  onSubmit: boolean;
};

export const DogForm: FC<DogFormProps> = (props) => {
  const { dog, onChange, onSubmit } = props;
  const {
    validateOnBlur,
    validateOnChange,
    getError,
    validateAll,
  } = DogValidation();

  const handleDogBlur = validateOnBlur(dog);
  const handleDogChange = validateOnChange(onChange, dog);

  useEffect(() => {
    onSubmit && validateAll(dog);
  }, [onSubmit])

  return (
    <>
      <div>
        <label>Dog Name</label>
        <input
          name="name"
          onBlur={handleDogBlur}
          onChange={handleDogChange}
          value={dog.name}
        />
        {getError('name') && <p>{getError('name')}</p>}
      </div>
      <div>
        <label>Breed</label>
        <input
          name="breed"
          onBlur={handleDogBlur}
          onChange={handleDogChange}
          value={dog.breed}
        />
        {getError('breed') && <p>{getError('breed')}</p>}
      </div>
    </>
  );
}
