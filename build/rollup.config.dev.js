import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { minify } from 'uglify-es';
import { name, version, author } from '../package.json';
import postcss from 'rollup-plugin-postcss';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

async function main() {
  const results = [];
  let packages = [];
  const plugins = [
    eslint({
      exclude: [],
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
      // jail: '/src'
    }),
    commonjs({
      include: 'node_modules/**',
      exclude: 'src/**',
    }),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    production &&
      uglify(
        {
          compress: {
            drop_console: true,
          },
        },
        minify
      ),
    filesize(),
  ];

  let banner =
    `${'/*!\n' + ' * '}${name}.js v${version}\n` +
    ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
    ` * Released under the MIT License.\n` +
    ` */`;

  results.push({
    input: 'src/main.js',
    output: {
      file: 'example/dist/engine.js',
      format: 'umd',
      banner,
      sourcemap: true,
      name: 'Engine',
    },
    plugins,
  });

  // shapes: { name: 'Arc' },
  //  { name: 'Circle' },
  //  { name: 'Curve' },
  //  { name: 'Path' },
  //  { name: 'Polygon' },
  //  { name: 'Polyline' },
  //  { name: 'Rectangle' },
  //  { name: 'Sprite' }

  packages = [
    { name: 'hierarchy', path: 'modules/hierarchy/index.js', type: 'module' },
    { name: 'Performance', path: 'plugins/Performance.js', type: 'plugin' },
    { name: 'Grid', path: 'plugins/Grid.js', type: 'plugin' },
    { name: 'Input', path: 'plugins/Input.js', type: 'plugin' },
  ];
  packages.forEach((pkg) => {
    let input = `src/packages/${pkg.path}`;
    let banner =
      `${'/*!\n' + ' * '}${pkg.name}.js v${version}\n` +
      ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
      ` * Released under the MIT License.\n` +
      ` */`;

    results.push({
      input,
      output: {
        file: `example/dist/${pkg.type}s/${pkg.name}.js`,
        format: 'umd',
        banner,
        sourcemap: true,
        name: pkg.name,
      },
      plugins,
    });
  });

  return results;
}

export default main();
