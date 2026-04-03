import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SWIFTMessagingApi implements ICredentialType {
	name = 'sWIFTMessagingApi';
	displayName = 'SWIFT Messaging API';
	documentationUrl = 'https://docs.velocitybpa.com/integrations/swift-messaging';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.swiftref.com/v1',
			description: 'Base URL for the SWIFT messaging service API',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'sandbox',
		},
	];
}