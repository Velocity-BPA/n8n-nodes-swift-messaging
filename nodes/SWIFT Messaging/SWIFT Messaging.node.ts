/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-swiftmessaging/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class SWIFTMessaging implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'SWIFT Messaging',
    name: 'swiftmessaging',
    icon: 'file:swiftmessaging.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the SWIFT Messaging API',
    defaults: {
      name: 'SWIFT Messaging',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'swiftmessagingApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'SwiftMessage',
            value: 'swiftMessage',
          },
          {
            name: 'BicDirectory',
            value: 'bicDirectory',
          },
          {
            name: 'IBAN Utility',
            value: 'ibanUtility',
          }
        ],
        default: 'swiftMessage',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['swiftMessage'] } },
	options: [
		{ name: 'Validate Message', value: 'validateMessage', description: 'Validate SWIFT message format', action: 'Validate a SWIFT message' },
		{ name: 'Parse Message', value: 'parseMessage', description: 'Parse SWIFT message fields', action: 'Parse a SWIFT message' },
		{ name: 'Create Message', value: 'createMessage', description: 'Create SWIFT message', action: 'Create a SWIFT message' },
		{ name: 'Get Formats', value: 'getFormats', description: 'List supported message formats', action: 'Get supported message formats' },
	],
	default: 'validateMessage',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['bicDirectory'] } },
  options: [
    { name: 'Validate BIC', value: 'validateBic', description: 'Validate BIC format and existence', action: 'Validate a BIC code' },
    { name: 'Lookup BIC', value: 'lookupBic', description: 'Get bank details by BIC', action: 'Lookup BIC details' },
    { name: 'Search BIC', value: 'searchBic', description: 'Search banks by criteria', action: 'Search for BIC codes' }
  ],
  default: 'validateBic',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['ibanUtility'],
		},
	},
	options: [
		{
			name: 'Validate IBAN',
			value: 'validateIban',
			description: 'Validate IBAN format and checksum',
			action: 'Validate IBAN',
		},
		{
			name: 'Generate IBAN',
			value: 'generateIban',
			description: 'Generate IBAN from account details',
			action: 'Generate IBAN',
		},
		{
			name: 'Parse IBAN',
			value: 'parseIban',
			description: 'Extract components from IBAN',
			action: 'Parse IBAN',
		},
	],
	default: 'validateIban',
},
{
	displayName: 'Message Type',
	name: 'messageType',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['swiftMessage'], operation: ['validateMessage'] } },
	default: '',
	description: 'SWIFT message type (e.g., MT103, MT202, MX)',
	placeholder: 'MT103',
},
{
	displayName: 'Message Content',
	name: 'messageContent',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['swiftMessage'], operation: ['validateMessage'] } },
	default: '',
	description: 'SWIFT message content to validate',
	typeOptions: { rows: 5 },
},
{
	displayName: 'Message Content',
	name: 'messageContent',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['swiftMessage'], operation: ['parseMessage'] } },
	default: '',
	description: 'SWIFT message content to parse',
	typeOptions: { rows: 5 },
},
{
	displayName: 'Message Type',
	name: 'messageType',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['swiftMessage'], operation: ['parseMessage'] } },
	default: '',
	description: 'SWIFT message type for parsing',
	placeholder: 'MT103',
},
{
	displayName: 'Message Type',
	name: 'messageType',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['swiftMessage'], operation: ['createMessage'] } },
	default: '',
	description: 'SWIFT message type to create',
	placeholder: 'MT103',
},
{
	displayName: 'Fields',
	name: 'fields',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['swiftMessage'], operation: ['createMessage'] } },
	default: '{}',
	description: 'JSON object containing SWIFT message fields',
	placeholder: '{"senderBIC": "ABCDUS33", "receiverBIC": "EFGHGB2L", "amount": "1000.00"}',
},
{
  displayName: 'BIC Code',
  name: 'bicCode',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['bicDirectory'], operation: ['validateBic', 'lookupBic'] } },
  default: '',
  placeholder: 'CHASUS33XXX',
  description: 'The Bank Identifier Code to validate or lookup',
},
{
  displayName: 'Country',
  name: 'country',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bicDirectory'], operation: ['searchBic'] } },
  default: '',
  placeholder: 'US',
  description: 'Two-letter country code for search',
},
{
  displayName: 'City',
  name: 'city',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bicDirectory'], operation: ['searchBic'] } },
  default: '',
  placeholder: 'New York',
  description: 'City name to search for banks',
},
{
  displayName: 'Bank Name',
  name: 'bankName',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bicDirectory'], operation: ['searchBic'] } },
  default: '',
  placeholder: 'JPMorgan Chase',
  description: 'Bank name to search for',
},
{
	displayName: 'IBAN Number',
	name: 'ibanNumber',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ibanUtility'],
			operation: ['validateIban'],
		},
	},
	default: '',
	placeholder: 'GB33BUKB20201555555555',
	description: 'The IBAN number to validate',
},
{
	displayName: 'Country Code',
	name: 'countryCode',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ibanUtility'],
			operation: ['generateIban'],
		},
	},
	default: '',
	placeholder: 'GB',
	description: 'Two-letter ISO country code',
},
{
	displayName: 'Bank Code',
	name: 'bankCode',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ibanUtility'],
			operation: ['generateIban'],
		},
	},
	default: '',
	placeholder: 'BUKB',
	description: 'Bank identifier code',
},
{
	displayName: 'Account Number',
	name: 'accountNumber',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ibanUtility'],
			operation: ['generateIban'],
		},
	},
	default: '',
	placeholder: '20201555555555',
	description: 'Account number including sort code',
},
{
	displayName: 'IBAN Number',
	name: 'ibanNumber',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ibanUtility'],
			operation: ['parseIban'],
		},
	},
	default: '',
	placeholder: 'GB33BUKB20201555555555',
	description: 'The IBAN number to parse',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'swiftMessage':
        return [await executeSwiftMessageOperations.call(this, items)];
      case 'bicDirectory':
        return [await executeBicDirectoryOperations.call(this, items)];
      case 'ibanUtility':
        return [await executeIBANUtilityOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeSwiftMessageOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('swiftmessagingApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'validateMessage': {
					const messageType = this.getNodeParameter('messageType', i) as string;
					const messageContent = this.getNodeParameter('messageContent', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/messages/validate`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body: {
							messageType,
							messageContent,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'parseMessage': {
					const messageContent = this.getNodeParameter('messageContent', i) as string;
					const messageType = this.getNodeParameter('messageType', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/messages/parse`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body: {
							messageContent,
							messageType,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createMessage': {
					const messageType = this.getNodeParameter('messageType', i) as string;
					const fields = this.getNodeParameter('fields', i) as any;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/messages/create`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body: {
							messageType,
							fields: typeof fields === 'string' ? JSON.parse(fields) : fields,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getFormats': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/messages/formats`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeBicDirectoryOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('swiftmessagingApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'validateBic': {
          const bicCode = this.getNodeParameter('bicCode', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/bic/validate`,
            params: {
              bicCode: bicCode,
            },
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'lookupBic': {
          const bicCode = this.getNodeParameter('bicCode', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/bic/lookup`,
            params: {
              bicCode: bicCode,
            },
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'searchBic': {
          const country = this.getNodeParameter('country', i) as string;
          const city = this.getNodeParameter('city', i) as string;
          const bankName = this.getNodeParameter('bankName', i) as string;
          
          const params: any = {};
          if (country) params.country = country;
          if (city) params.city = city;
          if (bankName) params.bankName = bankName;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/bic/search`,
            params: params,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeIbanUtilityOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('swiftmessagingApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'validateIban': {
					const ibanNumber = this.getNodeParameter('ibanNumber', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/iban/validate`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							ibanNumber: ibanNumber,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'generateIban': {
					const countryCode = this.getNodeParameter('countryCode', i) as string;
					const bankCode = this.getNodeParameter('bankCode', i) as string;
					const accountNumber = this.getNodeParameter('accountNumber', i) as string;
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/iban/generate`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							countryCode: countryCode,
							bankCode: bankCode,
							accountNumber: accountNumber,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'parseIban': {
					const ibanNumber = this.getNodeParameter('ibanNumber', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/iban/parse`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							ibanNumber: ibanNumber,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
