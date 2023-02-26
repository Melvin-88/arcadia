const path = require('path');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const package = require('./package.json');

const { peerDependencies } = package;

const IMAGE_ASSET_MAX_SIZE = 8192;

const SOURCE_DIR = path.resolve(__dirname, './src');
const ASSETS_SOURCE_DIR = `${SOURCE_DIR}/assets`;
const STYLES_SOURCE_DIR = `${SOURCE_DIR}/styles`;
const BUILD_DIR = path.resolve(__dirname, './dist');

module.exports = {
  entry: './index.ts',
  mode: 'production',
  output: {
    path: BUILD_DIR,
    filename: 'index.js',
    library: 'arcadia-common-fe',
    libraryTarget: 'umd',
  },
  context: SOURCE_DIR,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          {
            loader: 'source-map-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: function insertAtTop(element) {
                var parent = document.querySelector('head');
                var lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer(),
                ],
                sourceMap: false,
              },
            },
          },
          {
            loader: 'sass-loader',
            query: {
              sourceMap: false,
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(SOURCE_DIR, './styles/mixins.scss'),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|bmp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: IMAGE_ASSET_MAX_SIZE,
              mimetype: 'image/[ext]',
              name: 'assets/images/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/fonts/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: ASSETS_SOURCE_DIR, to: 'assets' },
        { from: STYLES_SOURCE_DIR, to: 'styles' },
      ],
    }),
  ],
  externals: Object.keys(peerDependencies).reduce((accumulator, packageName) => ({
    ...accumulator,
    [packageName]: {
      commonjs: packageName,
      commonjs2: packageName,
      amd: packageName,
      root: packageName,
    },
  }), {}),
};
