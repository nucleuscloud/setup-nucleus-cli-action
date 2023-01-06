import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as httpm from '@actions/http-client'

import os from 'os'

// arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
// return value in [amd64, 386, arm]
function mapArch(arch: string): string {
  const mappings: Record<string, string> = {
    x32: '386',
    x64: 'amd64'
  }
  return mappings[arch] || arch
}

// os in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
// return value in [darwin, linux, windows]
function mapOS(ops: string): string {
  const mappings: Record<string, string> = {
    darwin: 'darwin',
    win32: 'windows'
  }
  return mappings[ops] || ops
}

interface GithubReleaseResponse {
  tag_name: string
  name: string
}

function getUrl(version: string): string {
  const platform = os.platform()
  const ops = mapOS(platform)
  const arch = mapArch(os.arch())
  const filename = `nucleus_${version}_${ops}_${arch}`
  const extension = 'tar.gz'
  return `https://github.com/nucleuscloud/cli/releases/download/v${version}/${filename}.${extension}`
}

export async function getDownloadUrl(version?: string): Promise<string> {
  if (version && version !== '' && version !== 'latest') {
    core.info(`Downloading Nucleus CLI version ${version}`)
    return getUrl(version)
  }

  try {
    const http: httpm.HttpClient = new httpm.HttpClient('http-client', [], {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const res: httpm.HttpClientResponse = await http.get(
      'https://api.github.com/repos/nucleuscloud/cli/releases?per_page=1'
    )
    const body: string = await res.readBody()
    const releases: GithubReleaseResponse[] = JSON.parse(body)
    const latestRelease = releases[0]
    const latestVersion = latestRelease.tag_name || latestRelease.name
    if (!latestVersion) {
      core.setFailed('failed to retrieve latest release')
    }

    core.info(`Downloading latest Nucleus CLI version ${latestVersion}.`)

    return getUrl(latestVersion.replace('v', ''))
  } catch (err) {
    core.setFailed('Failed to download latest Nucleus CLI')
    throw err
  }
}

export async function login(
  clientId?: string,
  clientSecret?: string
): Promise<void> {
  if (!clientId || !clientSecret) {
    core.info(`Missing client id and client secret. Skipping login.`)
    return
  }

  const loginArgs: string[] = ['login', '--service-account']
  loginArgs.push('--client-id', clientId)

  core.info(`Logging into Nucleus`)

  try {
    await exec.getExecOutput('nucleus', loginArgs, {
      ignoreReturnCode: false,
      silent: false,
      input: Buffer.from(clientSecret)
    })

    core.info(`Login Succeeded!`)
  } catch (err) {
    core.setFailed('Fit failed to login')
  }
}

export async function logout(): Promise<void> {
  const logoutArgs: string[] = ['logout', '--service-account']

  core.info(`Logging out of Nucleus`)

  try {
    await exec.getExecOutput('nucleus', logoutArgs)
    core.info(`Logout Succeeded!`)
  } catch (err) {
    core.setFailed('Failed to logout')
  }
}
