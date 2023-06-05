# Ziplo - Github Action

This action help you to protect your source code with Ziplo.

## Inputs

### `organization-token`

**Required** The unique token available in the back-office of your organization (go on page https://ziplo.fr/app/integrations).

![Image of access token](https://ziplo.fr/img/integrations/ziplo-integration-token-example.png)

### `project-token`

**Required** The unique token available in the back-office for your consignment project (see documentation on ziplo website).

![Image of project token](https://ziplo.fr/img/integrations/ziplo-github-actions-example.png)

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

You have some examples files in the [`examples`](examples/) directory of this project.