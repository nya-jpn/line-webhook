import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { WebhookStack } from '../lib/webhook';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new WebhookStack(app, 'MyTestStack', {
      lambdaCodeDir: '',
      lambdaLayerDir: '',
      lineChannelAccessToken: '',
      lineChannelSecret: ''
    });
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
