// import typescript from '@rollup/plugin-typescript';
import ts from '@rollup/plugin-typescript';
// import html from 'rollup-plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import prettier from 'rollup-plugin-prettier';
import remove from 'rollup-plugin-delete';
import replace from '@rollup/plugin-replace';
// import generatePackageJson from 'rollup-plugin-generate-package-json';
import { eslint } from 'rollup-plugin-eslint';
import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import json from '@rollup/plugin-json';

import glob from 'glob';
import camelcase from 'camelcase';

// Outout dir
const outDir = 'dist';

const oneTimePlugins = [
  eslint({
    // throwOnError: true,
    include: ['**/*.js', '**/*.ts', 'node_modules'],
  }),
  clear({
    targets: [outDir],
  }),
];

// Serve and live reload in watch mode
if (process.env.ROLLUP_WATCH) {
  oneTimePlugins.push(
    serve({
      open: true,
      contentBase: outDir,
    })
  );
  oneTimePlugins.push(livereload({ watch: outDir }));
}

// Compile components separately
const components = glob.sync('./src/components/**/index.ts').map((file, i, arr) => {
  // if (file.includes('lexical')) {
  //   return;
  // }
  const componentName = camelcase(file.split('/').at(-2));
  const componentPath = file.replace('/index.ts', '');
  const outputJs = file.replace('src', outDir).replace('index.ts', componentName + '.js');
  const outputJsDist = file.replace('src', outDir).replace('index.ts', componentName + '.dist.js');

  // Create package.json for the component
  const pkg = require(componentPath + '/package.json');
  pkg.main = componentName + '.js';
  pkg.module = componentName + '.js';
  pkg.type = 'module';

  // inser one time plugins in last iteration
  let plugins = [
    replace({
      'process.env.NODE_ENV': '"production"',
    }),
  ];
  if (arr.length - 1 === i) {
    plugins = oneTimePlugins;
  }

  const COMPONENT = {
    onwarn: (warning, next) => {
      if (warning.code === 'DEPRECATED_FEATURE' || warning.code === 'PLUGIN_WARNING') return;
      next(warning);
    },
    input: file,
    output: [
      {
        file: outputJs,
        format: 'esm',
        name: componentName,
        plugins: [prettier()],
      },
      {
        file: outputJsDist,
        format: 'iife',
        name: componentName,
        plugins: [terser()],
      },
    ],
    plugins: [
      ...plugins,
      json(),
      commonjs({
        // namedExports: {
        //   roosterjs: Object.keys(rooster),
        // },
        include: /node_modules/,
        requireReturnsDefault: 'auto', // <---- this solves default issue
      }),
      resolve(),
      ts({
        compilerOptions: {
          lib: ['es5', 'es6', 'dom'],
          target: 'es2017',
          typeRoots: ['node_modules/@types'],
        },
        exclude: ['node_modules', 'dist', 'scripts', 'src/tests'],
      }),
      copy({
        targets: [
          {
            src: componentPath + '/README.md',
            dest: componentPath.replace('src', outDir),
          },
          {
            src: componentPath + '/package.json',
            dest: componentPath.replace('src', outDir),
          },
        ],
      }),
      remove({
        targets: [
          componentPath.replace('src', outDir) + '/types/*',
          componentPath.replace('src', outDir) + '/components/*',
        ],
      }),
    ],
    watch: {
      include: 'src/**',
    },
  };

  return COMPONENT;
});

export default components;
