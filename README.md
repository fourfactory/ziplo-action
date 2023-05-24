# Ziplo - Github Action

This action help you to protect your source code with Ziplo.

## Inputs

### `organization-token`

**Required** The unique token available in the back-office for your organization.

### `project-token`

**Required** The unique token available in the back-office for your consignment project (see documentation).

### `version`

Version number of your app

### `filepath`

Relative path of your file you want to protect in Ziplo

## Example usage

```yaml
uses: fourfactory/ziplo-action@v2.0
with:
  organization-token: 'ABCDEF1234567890'
  project-token: 'ABC0987654321DEF'
  version: 'v1.2.3'
  filepath: 'my-project.tar.gz'
```