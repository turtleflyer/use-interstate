import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const basePluginTransformRuntimeSettings = {
  corejs: false,
  helpers: true,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('@babel/runtime/package.json').version,
  regenerator: true,
};

const createRollupConfESM_CJS = (babelPlugins, output, externalBabelRuntime) => ({
  input: './ts/src/useInterstate.js',

  external: [externalBabelRuntime, 'react'],

  plugins: [
    babel({
      comments: false,
      babelHelpers: 'runtime',
      presets: [['@babel/preset-env', { exclude: ['transform-typeof-symbol'] }]],
      plugins: babelPlugins,
    }),
  ],

  output,
});

export default [
  createRollupConfESM_CJS(
    [
      [
        '@babel/plugin-transform-runtime',
        { ...basePluginTransformRuntimeSettings, useESModules: true },
      ],
    ],
    [{ file: pkg.module, format: 'es' }],
    /^@babel\/runtime\/.*\/esm\//
  ),

  createRollupConfESM_CJS(
    [
      [
        '@babel/plugin-transform-runtime',
        { ...basePluginTransformRuntimeSettings, useESModules: false },
      ],
    ],
    [{ file: pkg.main, format: 'cjs' }],
    /^@babel\/runtime\/(?!.*\/esm\/)/
  ),

  {
    input: './ts/src/useInterstate.js',

    external: ['react'],

    plugins: [
      babel({
        comments: false,
        babelHelpers: 'bundled',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: ['>0.2%', 'not dead', 'not op_mini all'],
              modules: false,
              exclude: ['transform-typeof-symbol'],
            },
          ],
        ],
      }),
      nodeResolve(),
      commonjs(),
      terser(),
    ],

    output: [
      { file: pkg.unpkg, format: 'umd', name: 'useInterstate', globals: { react: 'React' } },
    ],
  },
];
