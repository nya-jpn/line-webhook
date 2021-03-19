#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { WebhookStack } from '../lib/webhook';
import { join } from 'path'

const lambdaLayerDir = join(process.cwd(), '../cdk/dist/layer')
const lambdaCodeDir = join(process.cwd(), '../cdk/lambda')

const lineChannelAccessToken = 'A6fdHeS8is6J4zXRxcljRYCvBRaw0/ImWeaRJEfLZ3x8tLpgxuigFCubsbeML3B1U2wLmhTe/jzsMWKLemtc1NAkCLA79oBDerbBFqHz1ZBooU6q2sHMsPt8t7T5E6CQuQoG9A+KWcgT2RhzwNfSJwdB04t89/1O/w1cDnyilFU='
const lineChannelSecret = 'e25222e555ea1faacec6feb52256b279'

const app = new cdk.App();
new WebhookStack(app, 'WebhookStack', {
    lambdaCodeDir,
    lambdaLayerDir,
    lineChannelAccessToken,
    lineChannelSecret
});
