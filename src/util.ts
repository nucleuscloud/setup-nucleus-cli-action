import * as core from '@actions/core'
import * as exec from '@actions/exec'
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

export function getDownloadUrl(version: string): string {
  const platform = os.platform()
  const filename = `nucleus_${version}_${mapOS(platform)}_${mapArch(os.arch())}`
  const extension = 'tar.gz'
  return `https://github.com/nucleuscloud/cli/releases/download/v${version}/${filename}.${extension}`
}

export async function login(
  clientId: string,
  clientSecret: string
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
      ignoreReturnCode: true,
      silent: true,
      input: Buffer.from(clientSecret)
    })
    core.info(`Login Succeeded!`)
  } catch (err) {
    core.setFailed("Failed to login");
  }
}


export async function logout(): Promise<void> {
  const logoutArgs: string[] = ['logout', '--service-account']

  core.info(`Loggint out of Nucleus`)

  try {
    await exec.getExecOutput('nucleus', logoutArgs)
    core.info(`Logout Succeeded!`)
  } catch (err) {
    core.setFailed("Failed to logout");
  }
}
