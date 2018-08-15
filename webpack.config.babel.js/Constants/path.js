import { join } from 'path'

const baseDir = process.cwd();

export default {
   base: baseDir,
   module: join(baseDir, '/node_modules'),
   src: join(baseDir, '/src'),
   dist: join(baseDir, '/dist')
}