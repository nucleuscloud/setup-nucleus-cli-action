import * as core from '@actions/core'
import * as stateHelper from './state-helper'
import * as tc from '@actions/tool-cache'

import {Inputs, getInputs} from './context'
import {getDownloadUrl, login, logout} from './util'

export async function run(): Promise<{version?: string}> {
  try {
    const inputs: Inputs = getInputs()
    if (inputs.clientSecret && inputs.clientSecret !== '') {
      core.setSecret(inputs.clientSecret)
    }

    const shouldLogout: boolean = core.getBooleanInput('logout')
    stateHelper.setLogout(shouldLogout)

    // Download the specific version of the tool, e.g. as a tarball
    const pathToTarball = await tc.downloadTool(
      await getDownloadUrl(inputs.version)
    )

    // Extract the tarball onto the runner
    const pathToCLI = await tc.extractTar(pathToTarball)

    // Expose the tool by adding it to the PATH
    core.addPath(pathToCLI)
    await login(inputs.clientId, inputs.clientSecret)
    return {version: inputs.version}
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : 'Failed to setup Nucleus CLI'
    core.setFailed(errMsg)
    throw error
  }
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
