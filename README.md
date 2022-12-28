[![GitHub release](https://img.shields.io/github/release/nucleuscloud/setup-nucleus-cli-action.svg?style=flat-square)](https://github.com/nucleuscloud/setup-nucleus-cli-action/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-setup--nucleus--cli--action-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/setup-nucleus-cli-action)
[![Test workflow](https://img.shields.io/github/actions/workflow/status/nucleuscloud/setup-nucleus-cli-action/test.yml?branch=main&label=test&logo=github&style=flat-square)](https://github.com/nucleuscloud/setup-nucleus-cli-action/actions?workflow=test)

# setup-nucleus-cli-action

The `nucleuscloud/setup-nucleus-cli-action` is a Typescript action that sets up Nucleus CLI in your GitHub Actions workflow.

- Downloads a specific version of Nucleus CLI and adds it to the `PATH`.
- Handling Nucleus authentication using Nucleus service account.

After you've used the action, subsequent steps in the same job can run Nucleus commands using [the GitHub Actions `run` syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsrun). This allows Nucleus commands to work like they do on your local command line.

## Usage

### Nucleus CLI

Download Nucleus CLI and not authenticate with Nucleus.

```yaml
name: ci

on:
  push:
    branches: main

jobs:
  login:
    runs-on: ubuntu-latest
    steps:
      - name: Download Nucleus CLI
        uses: nucleuscloud/setup-nucleus-cli-action@v1
```

Set up a Nucleus service account in order to authenticate against Nucleus CLI.
When client id and client secret included the github action will handle login.

```yaml
name: ci

on:
  push:
    branches: main

jobs:
  login:
    runs-on: ubuntu-latest
    steps:
      - name: Download Nucleus CLI & Login
        uses: nucleuscloud/setup-nucleus-cli-action@v1
        with:
          version: 0.0.26
          client_id: ${{ secrets.CLIENT_ID }}
          client_secret: ${{ secrets.CLIENT_SECRET }}
      - name: 'Use nucleus CLI'
        run: 'nucleus -h'
```

## Customizing

### inputs

| Name            | Type    | Default | Required | Description                            |
| --------------- | ------- | ------- | -------- | -------------------------------------- |
| `version`       | String  | latest  | false    | Nucleus CLI version                    |
| `client_id`     | String  |         | false    | Client id for logging into Nucleus     |
| `client_secret` | String  |         | false    | Client secret for logging into Nucleus |
| `logout`        | boolean | true    | false    | Logout from Nucleus at end of a job    |
