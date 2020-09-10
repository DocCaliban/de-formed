export interface ValidationFunction<S> {
  (val: any, state: S): boolean;
};

export interface ValidationProps<S> {
  errorMessage: string;
  validation: ValidationFunction<S>;
};

export interface ValidationSchema<S> {
  [key: string]: ValidationProps<S>[];
};

export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    error: string;
  };
};

export interface ValidationObject {
  getError: (property: string) => string;
  getFieldValid: (property: string) => boolean;
  isValid: boolean;
  validate: (property: string, value: unknown, state?: any) => boolean | undefined;
  validateAll: (state: any) => boolean;
  validateIfTrue: (property: string, value: unknown, state?: any) => boolean | undefined;
  validateOnBlur: (state: any) => (event: any) => any;
  validateOnChange: (onChange: (event: any) => any, state: any) => (event: any) => any;
  validationErrors: string[];
  validationState: ValidationState;
};

