import glob from 'glob'
import { ProvidePlugin } from 'webpack'

export default {
   entry: {
      // legacy: glob.sync(`${pathConst.src}/Legacy/*.js`),
   },
   plugins: [
      new ProvidePlugin({
         $: 'jquery',
         jQuery: 'jquery'
      })
   ],
   resolve: {
      alias: {
         jquery: 'jquery'
      }
   }
}