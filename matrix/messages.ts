import ky from 'ky'
import * as sdk from 'matrix-js-sdk'

export { receiveMessages, sendMessage }

type MessageCallback = (blob: Blob) => void

function receiveMessages(client: sdk.MatrixClient, callback: MessageCallback) {
  const now = Date.now()
  client.on(sdk.RoomEvent.Timeline, async (event, room, toStartOfTimeline) => {
    if (toStartOfTimeline) return
    const eventType = event.getType()
    if (eventType !== 'm.room.message') return

    if (event.getTs() < now) return

    const roomId = room?.roomId
    if (!roomId) return

    const sender = event.getSender()
    if (sender === process.env.MATRIX_USER_ID) return

    const content = event.getContent()

    if (content.msgtype !== 'm.audio') return

    const httpUrl = client.mxcUrlToHttp(content.url)
    if (!httpUrl) return

    const blob = await ky.get(httpUrl).blob()

    callback(blob)
  })
}

async function sendMessage(
  client: sdk.MatrixClient,
  roomId: string,
  message: string,
) {
  const response = await client.sendTextMessage(roomId, message)
  return response.event_id
}
