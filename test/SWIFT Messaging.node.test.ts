/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { SWIFTMessaging } from '../nodes/SWIFT Messaging/SWIFT Messaging.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('SWIFTMessaging Node', () => {
  let node: SWIFTMessaging;

  beforeAll(() => {
    node = new SWIFTMessaging();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('SWIFT Messaging');
      expect(node.description.name).toBe('swiftmessaging');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 3 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(3);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(3);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('SwiftMessage Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.swift.example.com' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	describe('validateMessage operation', () => {
		it('should validate SWIFT message successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('validateMessage')
				.mockReturnValueOnce('MT103')
				.mockReturnValueOnce('{1:F01ABCDUS33AXXX}');

			const mockResponse = { valid: true, errors: [] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSwiftMessageOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle validation errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('validateMessage')
				.mockReturnValueOnce('MT103')
				.mockReturnValueOnce('invalid message');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Validation failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSwiftMessageOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toEqual([{ json: { error: 'Validation failed' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('parseMessage operation', () => {
		it('should parse SWIFT message successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('parseMessage')
				.mockReturnValueOnce('{1:F01ABCDUS33AXXX}')
				.mockReturnValueOnce('MT103');

			const mockResponse = { fields: { senderBIC: 'ABCDUS33' } };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSwiftMessageOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('createMessage operation', () => {
		it('should create SWIFT message successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createMessage')
				.mockReturnValueOnce('MT103')
				.mockReturnValueOnce({ senderBIC: 'ABCDUS33', receiverBIC: 'EFGHGB2L' });

			const mockResponse = { message: '{1:F01ABCDUS33AXXX}', created: true };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSwiftMessageOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getFormats operation', () => {
		it('should retrieve supported formats successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFormats');

			const mockResponse = { formats: ['MT103', 'MT202', 'MX'] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSwiftMessageOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('BicDirectory Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.swift.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('validateBic operation', () => {
    it('should validate BIC code successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('validateBic')
        .mockReturnValueOnce('CHASUS33XXX');

      const mockResponse = {
        valid: true,
        bicCode: 'CHASUS33XXX',
        status: 'active'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBicDirectoryOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle validation errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('validateBic')
        .mockReturnValueOnce('INVALID');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const error = new Error('Invalid BIC format');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeBicDirectoryOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: { error: 'Invalid BIC format' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('lookupBic operation', () => {
    it('should lookup BIC details successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('lookupBic')
        .mockReturnValueOnce('CHASUS33XXX');

      const mockResponse = {
        bicCode: 'CHASUS33XXX',
        bankName: 'JPMorgan Chase Bank',
        country: 'US',
        city: 'New York'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBicDirectoryOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('searchBic operation', () => {
    it('should search BIC codes successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchBic')
        .mockReturnValueOnce('US')
        .mockReturnValueOnce('New York')
        .mockReturnValueOnce('Chase');

      const mockResponse = {
        results: [
          {
            bicCode: 'CHASUS33XXX',
            bankName: 'JPMorgan Chase Bank',
            country: 'US',
            city: 'New York'
          }
        ],
        total: 1
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBicDirectoryOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle search errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchBic')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const error = new Error('Search criteria required');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeBicDirectoryOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: { error: 'Search criteria required' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('IBAN Utility Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.swift.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('validateIban', () => {
		it('should validate IBAN successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('validateIban')
				.mockReturnValueOnce('GB33BUKB20201555555555');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				valid: true,
				iban: 'GB33BUKB20201555555555',
				country: 'GB',
			});

			const result = await executeIbanUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.valid).toBe(true);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.swift.com/iban/validate',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				qs: {
					ibanNumber: 'GB33BUKB20201555555555',
				},
				json: true,
			});
		});

		it('should handle validation error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('validateIban')
				.mockReturnValueOnce('INVALID_IBAN');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid IBAN format'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeIbanUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Invalid IBAN format');
		});
	});

	describe('generateIban', () => {
		it('should generate IBAN successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('generateIban')
				.mockReturnValueOnce('GB')
				.mockReturnValueOnce('BUKB')
				.mockReturnValueOnce('20201555555555');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				iban: 'GB33BUKB20201555555555',
				countryCode: 'GB',
				bankCode: 'BUKB',
				accountNumber: '20201555555555',
			});

			const result = await executeIbanUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.iban).toBe('GB33BUKB20201555555555');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.swift.com/iban/generate',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					countryCode: 'GB',
					bankCode: 'BUKB',
					accountNumber: '20201555555555',
				},
				json: true,
			});
		});

		it('should handle generation error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('generateIban')
				.mockReturnValueOnce('XX')
				.mockReturnValueOnce('INVALID')
				.mockReturnValueOnce('123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid bank code'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeIbanUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Invalid bank code');
		});
	});

	describe('parseIban', () => {
		it('should parse IBAN successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('parseIban')
				.mockReturnValueOnce('GB33BUKB20201555555555');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				iban: 'GB33BUKB20201555555555',
				countryCode: 'GB',
				checkDigits: '33',
				bankCode: 'BUKB',
				branchCode: '202015',
				accountNumber: '55555555',
			});

			const result = await executeIbanUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.countryCode).toBe('GB');
			expect(result[0].json.bankCode).toBe('BUKB');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.swift.com/iban/parse',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				qs: {
					ibanNumber: 'GB33BUKB20201555555555',
				},
				json: true,
			});
		});

		it('should handle parsing error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('parseIban')
				.mockReturnValueOnce('MALFORMED_IBAN');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Cannot parse IBAN'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeIbanUtilityOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Cannot parse IBAN');
		});
	});
});
});
