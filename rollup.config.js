import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    external: [
      'lodash',
      '@lykmapipo/env',
      '@lykmapipo/common',
      'winston',
      'winston-daily-rotate-file',
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        interop: false,
        esModule: false,
        preferConst: true,
        strict: true,
      },
      { file: pkg.module, format: 'es' },
    ],
  },
];
