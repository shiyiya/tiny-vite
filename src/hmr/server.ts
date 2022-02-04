import ws from 'ws'
import WebSocket from 'ws'
import type { Server } from 'http'

export const createHRMServer = (server: Server) => {
  const wss = new ws.Server({ server })

  wss.on('connection', function connection(ws) {
    console.log('HRM server: connected')
    ws.on('message', function incoming(message) {
      console.log('HRM server: received: %s', message)
    })
  })

  return {
    send(payload: any) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload))
        }
      })
    },
    close: wss.close
  }
}

export const handleHMRMessage = () => {}
