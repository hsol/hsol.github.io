import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import notifier from 'node-notifier';

export default (env) => {
   let messages = [];
   let notes = [];

   if (env.mode === 'development') {
      messages.push(`빌드를 완료하였습니다.`);
   }

   if (env.analyzer) {
      messages.push('Entry 분석을 위한 빌드가 완료되었습니다.');
   }

   if (env.watch) {
      notes.push('코드를 수정하면 페이지에 자동으로 빌드합니다.');
   }

   // noinspection JSUnusedGlobalSymbols
   return {
      stats: 'minimal',
      plugins: [
         new FriendlyErrorsPlugin({
            clearConsole: true,
            compilationSuccessInfo: { messages: messages, notes: notes },
            onErrors: (severity, errors) => {
               if (severity !== 'error') {
                  return;
               }
               const error = errors[0];
               notifier.notify({
                  title: 'Webpack 빌드실패',
                  message: severity + ': ' + error.name,
                  subtitle: error.file || '',
                  icon: null
               });
            }
         })
      ]
   }
}
