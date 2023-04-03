# Ziplo - Github Action

This action help you to make automatic consignment of your source code.

## Inputs

### `organization-token`

**Required** The unique token available in the back-office for your organization.

## Outputs

### `generated-token`

The token generated for your consignment

## Example usage

```yaml
uses: fourfactory/ziplo-action@v1.0.0
with:
  organization-token: 'ABCDEF1234567890'
```