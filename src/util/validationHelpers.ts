import { ValidationSchema } from "types/validation.type";

// -- Build Validation State Object -------------------------------------
export const createValidationsState = (schema: ValidationSchema<any>) => {
  const keys = Object.keys(schema);
  return keys.reduce(
    (prev: any, item: string) => {
      prev[item] = {
        isValid: true,
        error: ''
      };
      return prev;
    },
    {}
  );
};
