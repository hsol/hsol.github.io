import merge from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import pathConst from './Constants/path'

import prodConfig from './Environments/prod'
import devConfig from './Environments/dev'

export default (env) => {
   return merge(
      {
         entry: { base: pathConst.src },
         output: {
            path: pathConst.dist,
            filename: '[name].min.js'
         },
         module: {
            rules: [
               {
                  test: /\.(js|jsx)?$/,
                  include: pathConst.src,
                  loader: 'babel-loader',
                  options: {
                     cacheDirectory: true,
                     plugins: ['react-hot-loader/babel'],
                  },
               }
            ]
         },
         resolve: {
            extensions: ['.js', '.jsx'],
            modules: [
               'node_modules'
            ],
            symlinks: false
         }
      },
      env.analyzer ? { plugins: [new BundleAnalyzerPlugin()] } : {},
      env.mode === 'production' ? prodConfig : devConfig,
   )
}