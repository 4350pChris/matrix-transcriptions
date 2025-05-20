import ky from 'ky'
import * as sdk from 'matrix-js-sdk'
import { KnownMembership } from 'matrix-js-sdk/lib/types.js'
import { envs } from './env.js'

export { receiveMessages, sendMessage, autoJoinRooms }

type MessageCallback = (blob: Blob, sender: string) => void

function receiveMessages(client: sdk.MatrixClient, callback: MessageCallback) {
  const now = Date.now()
  const userId = client.getUserId()
  if (!userId) {
    throw new Error('No user ID for own user found')
  }
  client.on(sdk.RoomEvent.Timeline, async (event, room, toStartOfTimeline) => {
    if (toStartOfTimeline) return
    const eventType = event.getType()
    if (eventType !== 'm.room.message') return

    if (event.getTs() < now) return

    const roomId = room?.roomId
    if (!roomId) return

    const senderId = event.getSender()
    if (!senderId || senderId === userId) return

    const content = event.getContent()
    if (content.msgtype !== 'm.audio') return

    const httpUrl = client.mxcUrlToHttp(content.url, undefined, undefined, undefined, undefined, undefined, true)
    if (!httpUrl) return

    const sender = room.getMember(senderId)?.name ?? 'Unknown User'
    const blob = await ky.get(httpUrl, {
      headers: {
        Authorization: `Bearer ${envs.MATRIX_USER_ACCESS_TOKEN}`,
      },
    }).blob()

    callback(blob, sender)
  })
}

function autoJoinRooms(client: sdk.MatrixClient) {
  client.on(
    sdk.RoomEvent.MyMembership,
    async (room, membership, prevMembership) => {
      if (membership === KnownMembership.Invite) {
        await client.joinRoom(room.roomId)
        console.log(`Auto-joined ${room.name} (id: ${room.roomId})`)
      }
    },
  )
}

async function sendMessage(
  client: sdk.MatrixClient,
  roomId: string,
  message: string,
) {
  const response = await client.sendTextMessage(roomId, message)
  return response.event_id
}
