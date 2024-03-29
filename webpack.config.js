const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nib = require('nib');
const pkg = require('./package.json');

const publicName = pkg.name; // package name
const banner = [
  `${publicName} v${pkg.version}`,
  `(c) ${new Date().getFullYear()} Mark Lin.`,
  pkg.license,
  pkg.homepage,
].join(' | ');
const localClassPrefix = publicName.replace(/^react-/, ''); // Strip out "react-" from publicName

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    /**
     * An object with { root, amd, commonjs, ... } is only allowed for libraryTarget: 'umd'.
     * It's not allowed for other library targets.
     * https://webpack.js.org/configuration/externals/#object
     */
    library: {
      type: 'umd',
    },
  },
  /**
   * Fix issue `Minified React error #321` when import from npm
   * https://reactjs.org/docs/error-decoder.html?invariant=321
   *
   * Solution:https://github.com/facebook/react/issues/16029#issuecomment-570912067
   */
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },
  module: {
    rules: [
      // Process JS with Babel
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.styl$/,
        // extract-text-webpack-plugin not support
        // Apply mini-css-extract-plugin instead
        // https://bbs.huaweicloud.com/blogs/detail/241981
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              importLoaders: 1,
              modules: {
                exportLocalsConvention: 'camelCase',
                localIdentName: `${localClassPrefix}---[local]---[hash:base64:5]`,
              },
            },
          },
          {
            loader: 'stylus-loader', // compiles Stylus to CSS
            options: {
              stylusOptions: {
                use: [nib()],
                import: ['nib'],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // This has effect on the react lib size
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new ESLintPlugin({
      formatter: eslintFormatter,
      eslintPath: require.resolve('eslint'),
      exclude: ['node_modules', 'docs', 'dist', 'lib'],
      emitWarning: true,
      cache: false,
    }),
    new StylelintPlugin({
      configFile: './stylelint.config.js',
      files: ['*.styl'],
    }),
    new MiniCssExtractPlugin({
      filename: `../dist/${publicName}.css`,
    }),
    new webpack.BannerPlugin(banner),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
