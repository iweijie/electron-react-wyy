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
      components: path.join(appPath, 'components'),
      containers: path.join(appPath, 'containers'),
      constants: path.join(appPath, 'constants'),
      style: path.join(appPath, 'style'),
      utils: path.join(appPath, 'utils'),
      store: path.join(appPath, 'store'),
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
