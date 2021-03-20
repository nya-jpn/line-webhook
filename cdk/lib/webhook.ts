import { Stack, StackProps, Construct, Duration } from '@aws-cdk/core'
import { Function, Runtime, Code, Tracing, LayerVersion } from '@aws-cdk/aws-lambda'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway'

type WebhookStackProps = StackProps & {
	lambdaLayerDir: string
	lambdaCodeDir: string
	lineChannelAccessToken: string
	lineChannelSecret: string
}

export class WebhookStack extends Stack {
	constructor(scope: Construct, id: string, props: WebhookStackProps) {
		super(scope, id, props)

		const modulesLayer = new LayerVersion(this, 'WebhookNodeJsModulesLayer', {
			layerVersionName: 'webhook-modules',
			description: 'Node.js modules layer',
			compatibleRuntimes: [Runtime.NODEJS_14_X],
			license: 'UNLICENSED',
			code: Code.fromAsset(props.lambdaLayerDir),
		})

		const backend = new Function(this, 'WebhookBackend', {
			functionName: 'line-webhook-backend',
			description: 'Webhook backend for LINE Official Account',
			runtime: Runtime.NODEJS_14_X,
			code: Code.fromAsset(props.lambdaCodeDir),
			handler: 'webhook.handler',
			timeout: Duration.seconds(10),
			tracing: Tracing.ACTIVE,
			logRetention: RetentionDays.THREE_MONTHS,
			layers: [modulesLayer],
			environment: {
				LINE_CHANNEL_ACCESS_TOKEN: props.lineChannelAccessToken,
				LINE_CHANNEL_SECRET: props.lineChannelSecret,
			},
		})

		const endpoint = new RestApi(this, 'WebhookEndpoint')
		const api = endpoint.root.addResource('webhook')
		api.addMethod('POST', new LambdaIntegration(backend))
	}
}
