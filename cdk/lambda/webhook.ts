import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Client, TextMessage, validateSignature, ReplyableEvent, WebhookRequestBody } from '@line/bot-sdk'
import * as bunyan from 'bunyan'

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN!
const channelSecret = process.env.LINE_CHANNEL_SECRET!
const logger = new bunyan({ name: 'webhook-backend' })
const line = new Client({ channelAccessToken, channelSecret })

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	logger.info(event)

	// リクエスト検証の実施
	if (!validateSignature(event.body!, channelSecret, event.headers['x-line-signature']!)) {
		return { statusCode: 400, body: 'Bad Request' }
	}

	const body: WebhookRequestBody = JSON.parse(event.body!)
	const events = body.events

	for (let i = 0; i < events.length; i++) {
		if ('replyToken' in events[i]) {
			const event = events[i] as ReplyableEvent

			// TODO：アクションによって内容の変更
			const message: TextMessage = {
				type: 'text',
				text: 'Hello, World!',
			}
			const res = await line.replyMessage(event.replyToken, message)
			logger.info(res)
		}
	}

	return { statusCode: 200, body: 'OK' }
}
