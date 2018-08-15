import { join } from 'path'

const baseDir = process.cwd();

export default {
   base: baseDir,
   module: join(baseDir, '/node_modules'),
   assets: join(baseDir, '/assets'),
   src: join(baseDir, '/src'),
   dist: join(baseDir, '/dist')
}