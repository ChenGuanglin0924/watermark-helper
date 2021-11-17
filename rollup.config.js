import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
    input: './src/watermark-helper.ts',
    output: [
      {
        file: './dist/watermark-helper.cjs.js',
        format: 'cjs'
      },
      {
        file: './dist/watermark-helper.esm.js',
        format: 'esm'
      },
      {
        file: './dist/watermark-helper.js',
        format: 'umd',
        name: 'WatermarkHelper'
      },
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript()
    ]
};