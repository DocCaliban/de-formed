import babel from 'rollup-plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

export default {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    globals,
    sourcemap: true,
  },
  plugins: [
    babel({
      extensions,
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
  ],
  external: Object.keys(globals),
};
