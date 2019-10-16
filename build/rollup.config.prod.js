import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { minify } from 'uglify-es';
import copy from 'rollup-plugin-copy';
import { name, version, author } from '../package.json';

// banner
const banner =
  `${'/*!\n' + ' * '}${name}.js v${version}\n` +
  ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
  ` * Released under the MIT License.\n` +
  ` */`;

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
	output: {
    file: 'dist/bundle.js',
    format: 'es',
    banner,
    sourcemap: true
  },
	plugins: [
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      },
      jail: '/src'
    }),
    commonjs({
      include: 'node_modules/**',
      exclude: 'src/**'
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
		production && uglify(
      {
        compress: {
          drop_console: true
        },
      },
      minify,
    ),
    filesize(),
    copy({
      "public/index.prod.html": "dist/index.html",
    })
	]
};