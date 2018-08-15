import { HotModuleReplacementPlugin } from 'webpack'
import pathConst from "../Constants/path";

export default {
   plugins: [
      new HotModuleReplacementPlugin()
   ],
   devServer: {
      index: 'index.html',
      watchContentBase: true,
      contentBase: pathConst.dist,
      watchOptions: {
         poll: true
      },
      historyApiFallback: true,
      hot: true,
      overlay: true,
      open: true,
      inline: true
   }
}