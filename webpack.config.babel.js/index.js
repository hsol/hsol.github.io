import merge from 'webpack-merge'

import baseConfig from './base'
import terminalConfig from './Etc/terminal'
import styleConfig from './Etc/assets'

import legacyConfig from './Entries/legacy'

function initEnvironment(env = {}, args) {
   env = Object.assign(args);

   env.mode = env.mode || 'development';
   env.analyzer = env.analyzer || false;

   return env
}

// noinspection JSUnusedGlobalSymbols
export default (env, args) => {
   env = initEnvironment(env, args);

   return merge(
      baseConfig(env),
      terminalConfig(env),
      styleConfig(env),
      legacyConfig
   );
};
