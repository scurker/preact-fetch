import pkg from './package.json';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'es',
      file: pkg.module
    },
    {
      format: 'cjs',
      file: pkg.main
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['preact']
};