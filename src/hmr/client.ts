const ws = new WebSocket(`ws://${location.host}`)

ws.addEventListener('message', async ({ data }) => {
  handleHMRMessage(data)
})

function handleHMRMessage(payload: HMRMessage) {
  console.log(payload)
}
