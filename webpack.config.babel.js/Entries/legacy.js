import glob from 'glob'
import { ProvidePlugin } from 'webpack'

import pathConst from '../Constants/path'
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtractTextPlugin from "extract-text-webpack-plugin";

export default {
   entry: {
      legacy: glob.sync(`${pathConst.src}/Legacy/*.js`),
      'style.legacy': `${pathConst.src}/Legacy/styles/base.css`
   },
   plugins: [
      new ProvidePlugin({
         $: 'jquery',
         jQuery: 'jquery'
      }),
      new CopyWebpackPlugin([
         {
            from: `${pathConst.src}/Legacy/images`,
            to: `${pathConst.dist}/images`,
         }
      ])
   ],
   resolve: {
      alias: {
         jquery: 'jquery'
      }
   }
}