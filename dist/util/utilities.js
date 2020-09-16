var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
/**
 * Creates a random 7 character string.
 * @return string
 */
export var randomString = function () {
  return Math.random().toString(36).substring(7);
};
/**
 *  compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
 */
export var compose = function () {
  var fns = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    fns[_i] = arguments[_i];
  }
  return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return fns.reduceRight(function (res, fn) {
      return [fn.call.apply(fn, __spreadArrays([null], res))];
    }, args)[0];
  };
};
/**
 *  Evaluate any two values for deep equality
 *  @param a any value
 *  @param b any value
 *  @return boolean
 */
export var deepEqual = function (a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};
export var upsertItem = function (items, data, index) {
  return items.map(function (item, itemIndex) {
    return itemIndex === index
      ? __assign(__assign({}, item), data)
      : __assign({}, item);
  });
};
/**
 *  curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
 */
export function curry(fn) {
  var arity = fn.length;
  return function $curry() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (args.length < arity) {
      return $curry.bind.apply($curry, __spreadArrays([null], args));
    }
    return fn.call.apply(fn, __spreadArrays([null], args));
  };
}
/**
 *  trim :: String -> String
 */
export var trim = function (s) {
  return s.trim();
};
/**
 *  head :: [a] -> a
 */
export var head = function (xs) {
  return xs[0];
};
/**
 *  map :: (a -> b) -> [a] -> [b]
 */
export var map = curry(function (f, xs) {
  return xs.map(f);
});
/**
 *  reduce :: ((b, a) -> b) -> b -> [a] -> b
 */
export var reduce = curry(function (f, x, xs) {
  return xs.reduce(f, x);
});
/**
 *  prop :: String -> {a} -> [a | Undefined]
 */
export var prop = curry(function (p, obj) {
  return obj ? obj[p] : undefined;
});
var reduceTruthy = function (prev, current) {
  return !!current ? prev : false;
};
export var all = reduce(reduceTruthy, true);
//# sourceMappingURL=utilities.js.map
