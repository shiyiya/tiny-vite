import { readFileSync } from 'fs'
import http from 'http'
import { join } from 'path'
import { parse } from './parse'
import { webRoot, webSrcPath } from './path'
import type { AddressInfo } from 'net'
import { createHRMServer } from './hmr/server'
import { parseScript } from './parse/parseScript'
import chokidar from 'chokidar'

const server = http.createServer((req, res) => {
  const url = new URL(req.url!, 'http://base.com')

  if (url.pathname === '/') {
    const html = readFileSync(join(webRoot, 'index.html'), 'utf-8')
      .replace(
        `<!-- %vitejs% -->`,
        `<script type="module" src="/@vite/hmr/client"></script>`
      )
      .replace(
        `<!-- %entry% -->`, //TODO: config cwd
        `<script type="module" src="/index.tsx"></script>`
      )
    res.setHeader('Content-Type', 'text/html').end(html)
  } else if (url.pathname === '/@vite/hmr/client') {
    res
      .setHeader('Content-Type', 'application/javascript')
      .end(parseScript(join(__dirname, './hmr/client.ts')))
  } else {
    parse(res, url)
  }
})

const ws = createHRMServer(server)

chokidar
  .watch(webSrcPath, {
    ignored: /(^|[\/\\])\../,
    ignoreInitial: true,
    ignorePermissionErrors: true,
    disableGlobbing: true
  })
  .on('change', (file) => {
    console.log(`[change]: ${join(webSrcPath, file)}`)
    ws.send(`[change]: ${join(webSrcPath, file)}`)
  })

server.listen(3000, function () {
  console.log(
    `[done]:  http://127.0.0.1:${(server.address() as AddressInfo).port}`
  )
})
