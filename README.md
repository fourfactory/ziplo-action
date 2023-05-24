# Ziplo - Github Action

This action help you to make automatic consignment of your source code.

## Inputs

### `organization-token`

**Required** The unique token available in the back-office for your organization.

### `version`

Version number of your app

### `filepath`

Relative path of your file you want to protect in Ziplo

## Example usage

```yaml
uses: fourfactory/ziplo-action@v2.0.0
with:
  organization-token: 'ABCDEF1234567890'
  version: 'v1.2.3'
  filepath: 'archive.tar.gz'
```