import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {getDownloadUrl} from './util'

export async function run(): Promise<{version: string}> {
  try {
    // Get version of tool to be installed
    const version: string = core.getInput('version')

    // Download the specific version of the tool, e.g. as a tarball
    const pathToTarball = await tc.downloadTool(getDownloadUrl(version))

    // Extract the tarball onto the runner
    const pathToCLI = await tc.extractTar(pathToTarball)

    // Expose the tool by adding it to the PATH
    core.addPath(pathToCLI)
    return {version}
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
    throw error
  }
}

run()
// module.exports = run;
