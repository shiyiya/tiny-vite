import React from 'react'
import ReactDOM from 'react-dom'
import name from './name'
import now from './util/date'
import { logNow } from './log'
import { App } from './app'

document.getElementById('root')!.innerHTML = /* @html */ `
  <h1>Hello, ${name} !\r\n</h1>
  <span>time: <time>${now().toLocaleString()}</time></span>
  `
requestAnimationFrame(logNow)

ReactDOM.render(<App />, document.getElementById('root'))
