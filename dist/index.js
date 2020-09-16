'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var validation_hook = require('src/validation/validation.hook');
var ValidationState = require('src/validation/ValidationState');

Object.defineProperty(exports, 'useValidation', {
  enumerable: true,
  get: function () {
    return validation_hook.useValidation;
  },
});
Object.defineProperty(exports, 'Validation', {
  enumerable: true,
  get: function () {
    return ValidationState.Validation;
  },
});
//# sourceMappingURL=index.js.map
