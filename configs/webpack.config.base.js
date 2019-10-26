/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies } from '../package.json';

const appPath = path.join(__dirname, '..','app')

export default {
  externals: [...Object.keys(dependencies || {})],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      actions: path.join(appPath, 'actions'),
      components: path.join(appPath, 'components'),
      containers: path.join(appPath, 'containers'),
      constants: path.join(appPath, 'constants'),
      reducers: path.join(appPath, 'reducers'),
      style: path.join(appPath, 'style'),
      tool: path.join(appPath, 'tool'),
      page: path.join(appPath, 'page'),
      static: path.join(appPath, 'static'),
      images: path.join(appPath, 'static/images'),
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin()
  ]
};
