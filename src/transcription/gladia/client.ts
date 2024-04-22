import ky from 'ky'

export { client }

const GLADIA_TOKEN = process.env.GLADIA_TOKEN

const headers = { 'x-gladia-key': GLADIA_TOKEN }

const client = ky.create({ headers, prefixUrl: 'https://api.gladia.io/v2' })
