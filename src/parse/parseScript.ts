import { extname } from 'path'
import { Loader, transformSync } from 'esbuild'
import { readFileSync } from 'fs'

export const parseScript = (path: string) =>
  transformSync(readFileSync(path, 'utf-8'), {
    loader: extname(path).slice(1) as Loader,
    sourcemap: true,
    format: 'esm'
  }).code
