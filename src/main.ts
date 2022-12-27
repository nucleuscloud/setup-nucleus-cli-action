import * as core from '@actions/core'
import * as stateHelper from './state-helper'
import * as tc from '@actions/tool-cache'

import {getDownloadUrl, login, logout} from './util'

export async function run(): Promise<{version?: string}> {
  try {
    // Get version of tool to be installed
    const version: string = core.getInput('version')
    if (!version) {
      core.setFailed('Nucleus CLI version missing')
    }
    const clientId: string = core.getInput('client_id')
    const clientSecret: string = core.getInput('client_secret')
    if (clientSecret !== '') {
      core.setSecret(clientSecret)
    }

    const shouldLogout: boolean = core.getBooleanInput('logout')
    stateHelper.setLogout(shouldLogout)

    core.info(`Downloading Nucleus CLI`)
    // Download the specific version of the tool, e.g. as a tarball
    const pathToTarball = await tc.downloadTool(getDownloadUrl(version))

    // Extract the tarball onto the runner
    const pathToCLI = await tc.extractTar(pathToTarball)

    // Expose the tool by adding it to the PATH
    core.addPath(pathToCLI)
    await login(clientId, clientSecret)
    return {version}
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : 'Failed to setup Nucleus CLI'
    core.setFailed(errMsg)
  }
  return {}
}

async function post(): Promise<void> {
  if (!stateHelper.Logout) {
    return
  }
  await logout()
}

if (!stateHelper.IsPost) {
  run()
} else {
  post()
}
