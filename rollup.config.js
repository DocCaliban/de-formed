import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

export default {
  input: './src/index.ts',

  output: [
    {
      file: './dist/index.js',
      format: 'umd',
      name: 'workingConfig',
      globals,
      sourcemap: true,
    },
    { file: './dist/index.module.js', format: 'es', globals, sourcemap: true },
  ],
  plugins: [
    commonjs({
      include: '**/node_modules/**',
      namedExports: {},
    }),
    babel({
      extensions,
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
  ],
  external: Object.keys(globals),
};
