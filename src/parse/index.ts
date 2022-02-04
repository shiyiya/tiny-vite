import { extname, join } from 'path'
import { parseScript } from './parseScript'
import type { ServerResponse } from 'http'
import { webSrcPath } from '../path'
import { createWriteStream, existsSync, statSync } from 'fs'

export function parse(res: ServerResponse, { pathname }: URL) {
  const ext = extname(pathname)

  if (['.tsx', '.ts', ''].includes(ext)) {
    res.setHeader('Content-Type', 'application/javascript')
    const p = join(webSrcPath, pathname)
    let path = ''

    if ('' === ext) {
      if (existsSync(p)) {
        if (statSync(p).isDirectory()) {
          path = tsOrTsx(join(p, '/index'))
        } else if (statSync(p).isFile()) {
          res.setHeader('Content-Type', 'raw')
          return res.pipe(createWriteStream(join(webSrcPath, pathname)))
        }
      } else {
        path = tsOrTsx(p)
      }
    } else {
      path = p
    }

    return p ? res.end(parseScript(path)) : res.writeHead(404).end()
  }
}

function tsOrTsx(pathname: string): string {
  if (existsSync(join(pathname + '.ts'))) {
    return join(pathname + '.ts')
  } else if (existsSync(join(pathname + '.tsx'))) {
    return join(pathname + '.tsx')
  } else {
    return ''
  }
}
