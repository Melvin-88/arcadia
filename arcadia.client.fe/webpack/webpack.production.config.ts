import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import SentryWebpackPlugin from '@sentry/webpack-plugin';
import { generateConfig as generateBasicConfig, moduleRules, RELEASE_ID } from './constants';
import { IEnvironment } from './types';

// TODO: Regenerate and extract to the process.env BEGIN
const SENTRY_AUTH_TOKEN = 'd4cb6b23b4224b39895f1e8f9941a2b5314b4b5c92c2455e97751c08c377935b';
// TODO: Regenerate and extract to the process.env END

export default (env: IEnvironment): webpack.Configuration => {
  const basicConfig = generateBasicConfig(env);
  const { module: basicConfigModule = {} as webpack.Module } = basicConfig;

  return {
    ...basicConfig,
    mode: 'production',
    devtool: 'source-map',
    bail: true,
    module: {
      rules: [
        ...basicConfigModule.rules,
        {
          ...moduleRules.cssLoader,
          use: [
            MiniCssExtractPlugin.loader,
            ...moduleRules.cssLoader.use as webpack.RuleSetUseItem[],
          ],
        },
        {
          ...moduleRules.scssLoader,
          use: [
            MiniCssExtractPlugin.loader,
            ...moduleRules.scssLoader.use as webpack.RuleSetUseItem[],
          ],
        },
      ],
    },
    plugins: [
      ...basicConfig.plugins || [],
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new SentryWebpackPlugin({
        authToken: SENTRY_AUTH_TOKEN,
        org: 'digicode', // TODO: Extract to const
        project: 'arcadia-client-fe', // TODO: Extract to const
        release: RELEASE_ID,
        include: '.',
        ignore: ['node_modules', 'webpack'],
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              drop_console: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true,
            },
          },
        }),
      ],
      runtimeChunk: {
        name: (entryPoint) => `webpack-runtime-${entryPoint.name}`,
      },
    },
  };
};
