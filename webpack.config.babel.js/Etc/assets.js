import pathConst from '../Constants/path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackExcludeAssetsPlugin  from 'html-webpack-exclude-assets-plugin'

export default () => {
   return {
      entry: {
         'style.base': [
            `${pathConst.module}/normalize.css`,
            `${pathConst.module}/bulma`
         ]
      },
      module: {
         rules: [
            {
               test: /\.(c|sc|sa)ss$/,
               exclude: '/node_modules/',
               use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                     'css-loader',
                     'sass-loader'
                  ]
               })
            },
            {test: /\.(png|jpg|woff|woff2|eot|ttf|otf|svg)/, loader: 'url-loader'},
         ]
      },
      plugins: [
         new ExtractTextPlugin({
            filename: 'styles/[name].css',
            allChunks: true
         }),
         new HtmlWebpackPlugin({
            template: `${pathConst.base}/index.html`,
            filename: 'index.html',
            excludeAssets: [/style.*.js/]
         }),
         new HtmlWebpackExcludeAssetsPlugin(),
         new CopyWebpackPlugin([
            {
               from: pathConst.assets,
               to: pathConst.dist,
            }
         ])
      ]
   }
}