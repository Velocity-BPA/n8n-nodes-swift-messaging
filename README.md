# n8n-nodes-swift-messaging

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for SWIFT messaging operations, providing access to 3 core resources for international financial communications. Enables creation, validation, and parsing of SWIFT messages, BIC directory lookups, and IBAN utilities for seamless integration with banking workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![SWIFT](https://img.shields.io/badge/SWIFT-Messages-green)
![Banking](https://img.shields.io/badge/Banking-Integration-orange)
![ISO 20022](https://img.shields.io/badge/ISO-20022-purple)

## Features

- **SWIFT Message Processing** - Create, validate, parse, and format SWIFT MT and MX messages
- **BIC Directory Access** - Lookup and validate Bank Identifier Codes with comprehensive bank information
- **IBAN Validation & Generation** - Validate IBANs, calculate check digits, and extract bank details
- **Multi-Format Support** - Handle both legacy MT messages and modern ISO 20022 XML formats
- **Real-time Validation** - Comprehensive field validation and error checking for message integrity
- **Batch Processing** - Process multiple messages, BICs, or IBANs in a single operation
- **Standards Compliance** - Full compliance with SWIFT, ISO 13616, and ISO 20022 standards
- **Error Reporting** - Detailed error messages with specific field-level validation feedback

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-swift-messaging`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-swift-messaging
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-swift-messaging.git
cd n8n-nodes-swift-messaging
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-swift-messaging
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | SWIFT messaging service API key for authentication | Yes |
| Environment | Service environment (sandbox/production) | Yes |
| Endpoint URL | Custom API endpoint if using private SWIFT service | No |

## Resources & Operations

### 1. Swift Message

| Operation | Description |
|-----------|-------------|
| Create | Generate new SWIFT MT or MX messages with specified parameters |
| Parse | Parse incoming SWIFT messages and extract structured data |
| Validate | Validate message format, fields, and compliance with SWIFT standards |
| Format | Convert between MT and MX message formats |
| Sign | Apply digital signatures to SWIFT messages |
| Verify | Verify digital signatures and message integrity |

### 2. BIC Directory

| Operation | Description |
|-----------|-------------|
| Lookup | Search for bank information using BIC codes |
| Validate | Validate BIC format and verify bank existence |
| Search | Search banks by name, country, or city |
| List | Retrieve list of BICs for a specific country or region |
| Details | Get comprehensive bank details including addresses and services |

### 3. IBAN Utility

| Operation | Description |
|-----------|-------------|
| Validate | Validate IBAN format and check digit verification |
| Generate | Generate IBAN from bank code and account number |
| Parse | Extract bank code, branch code, and account details from IBAN |
| Calculate Check Digits | Calculate and verify IBAN check digits |
| Format | Format IBAN with proper spacing and structure |
| Get Bank Info | Extract bank information from IBAN structure |

## Usage Examples

```javascript
// Create a SWIFT MT103 payment message
{
  "messageType": "MT103",
  "senderBIC": "DEUTDEFF",
  "receiverBIC": "CHASUS33",
  "amount": "1000.00",
  "currency": "USD",
  "debitAccount": "DE89370400440532013000",
  "creditAccount": "US64SVBKUS6S3300958879",
  "remittanceInfo": "Invoice payment INV-2024-001"
}
```

```javascript
// Validate and lookup BIC information
{
  "bicCode": "DEUTDEFF",
  "includeDetails": true,
  "includeBranches": false
}
```

```javascript
// Validate IBAN and extract bank details
{
  "iban": "DE89370400440532013000",
  "validateChecksum": true,
  "extractBankInfo": true,
  "format": "electronic"
}
```

```javascript
// Parse incoming SWIFT message
{
  "messageContent": ":20:FT21354FORWRD\n:23B:CRED\n:32A:211028USD1000,00\n:50K:/12345678901234567890\nJOHN DOE\n123 MAIN STREET\nNEW YORK NY 10001",
  "messageFormat": "MT",
  "validateFields": true,
  "extractMetadata": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid BIC Format | BIC code doesn't match required 8 or 11 character format | Verify BIC follows format: 4-letter bank code + 2-letter country + 2-character location + optional 3-character branch |
| IBAN Checksum Failure | IBAN check digits are invalid | Recalculate check digits or verify the account number and bank code |
| Message Validation Error | SWIFT message fields fail validation rules | Check required fields, field lengths, and format specifications for the message type |
| Authentication Failed | API key is invalid or expired | Verify API key credentials and check service subscription status |
| Unsupported Message Type | Attempting to process unsupported SWIFT message format | Ensure message type is supported (MT103, MT202, etc.) and format is correct |
| Rate Limit Exceeded | Too many API requests in timeframe | Implement retry logic with exponential backoff or reduce request frequency |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-swift-messaging/issues)
- **SWIFT Standards**: [SWIFT Documentation](https://www.swift.com/standards)
- **ISO 20022**: [ISO 20022 Standards](https://www.iso20022.org/)