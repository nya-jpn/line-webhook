#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { WebhookStack } from '../lib/webhook'
import { join } from 'path'

require('dotenv').config()

const lambdaLayerDir = join(process.cwd(), '../cdk/dist/layer')
const lambdaCodeDir = join(process.cwd(), '../cdk/lambda')

const lineChannelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN!
const lineChannelSecret = process.env.LINE_CHANNEL_SECRET!

const app = new cdk.App()
new WebhookStack(app, 'WebhookStack', {
	lambdaCodeDir,
	lambdaLayerDir,
	lineChannelAccessToken,
	lineChannelSecret,
})
