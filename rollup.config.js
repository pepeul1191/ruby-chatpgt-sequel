import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';
import svgr from '@svgr/rollup';
import json from '@rollup/plugin-json';

const production = !process.env.ROLLUP_WATCH;

const App = {
   input: 'src/entries/index.js',
   output: {
      file: production ? 'public/dist/app.min.js' : 'public/dist/app.js',
      format: 'iife'
   },
   plugins: [
      nodeResolve({
         extensions: ['.js', '.jsx']
      }),
      svgr(),
      babel({
         babelHelpers: 'bundled',
         presets: ['@babel/preset-react'],
         extensions: ['.js', '.jsx']
      }),
      terser(),
      commonjs(),
      json(),
      css({ 
         output: production ?  'app.min.css' : 'app.css'
      }),
      copy({
			targets: [
				{ 
					src: 'node_modules/font-awesome/fonts/*', 
					dest: 'public/fonts'
				},
				{ 
					src: 'node_modules/bootstrap-icons/font/fonts/*', 
					dest: 'public/build/fonts'
				}
			]
		}),
      replace({
         preventAssignment: false,
         'process.env.NODE_ENV': '"development"'
      })
   ],
   onwarn: function (warning) {
     if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
     //console.warn(warning.message);
   }
};

const Login = {
   input: 'src/entries/login.js',
   output: {
      file: production ? 'public/dist/login.min.js' : 'public/dist/login.js',
      format: 'iife',
      sourcemap: true, 
   },
   plugins: [
      nodeResolve({
         extensions: ['.js', '.jsx']
      }),
      babel({
         babelHelpers: 'bundled',
         presets: ['@babel/preset-react'],
         extensions: ['.js', '.jsx']
      }),
      commonjs(),
      json(),
      svgr(),
      css({ 
         output: production ?  'login.min.css' : 'login.css'
      }),
      copy({
			targets: [
				{ 
					src: 'node_modules/font-awesome/fonts/*', 
					dest: 'public/fonts'
				},
				{ 
					src: 'node_modules/bootstrap-icons/font/fonts/*', 
					dest: 'public/build/fonts'
				}
			]
		}),
      terser(),
      replace({
         preventAssignment: false,
         'process.env.NODE_ENV': '"development"'
      })
   ],
   onwarn: function (warning) {
     if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
     //console.warn(warning.message);
   }
};


const Error = {
   input: 'src/entries/error.js',
   output: {
      file: production ? 'public/dist/error.min.js' : 'public/dist/error.js',
      format: 'iife'
   },
   plugins: [
      nodeResolve({
         extensions: ['.js', '.jsx']
      }),
      svgr(),
      babel({
         babelHelpers: 'bundled',
         presets: ['@babel/preset-react'],
         extensions: ['.js', '.jsx']
      }),
      terser(),
      commonjs(),
      json(),
      css({ 
         output: production ?  'error.min.css' : 'error.css'
      }),
      replace({
         preventAssignment: false,
         'process.env.NODE_ENV': '"development"'
      })
   ],
   onwarn: function (warning) {
     if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
     //console.warn(warning.message);
   }
};

export default [App, Error, Login];