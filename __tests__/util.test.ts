import * as exec from '@actions/exec'

import {expect, test} from '@jest/globals'
import {getDownloadUrl, login, logout} from '../src/util'

import os from 'os'

jest.mock('os')

describe.skip('util.ts', () => {
  let execSpy: jest.SpyInstance<Promise<exec.ExecOutput>>
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    execSpy = jest.spyOn(exec, 'getExecOutput').mockImplementation(async () => {
      return {
        exitCode: expect.any(Number),
        stdout: expect.any(Function),
        stderr: expect.any(Function)
      }
    })
  })

  test('login should skip', async () => {
    await login(undefined, undefined)
    expect(execSpy).not.toBeCalled()
  })
  test('login should call exec', async () => {
    const clientId = 'client-id'
    const clientSecret = 'client-secret'

    await login(clientId, clientSecret)

    expect(execSpy).toHaveBeenCalledWith(
      `nucleus`,
      ['login', '--service-account', '--client-id', clientId],
      {
        input: Buffer.from(clientSecret),
        silent: true,
        ignoreReturnCode: true
      }
    )
  })

  test('logout should call exec', async () => {
    await logout()
    expect(execSpy).toHaveBeenCalledWith(`nucleus`, [
      'logout',
      '--service-account'
    ])
  })

  test('get latest download url', async () => {
    os.platform = jest.fn().mockReturnValue('linux')

    os.arch = jest.fn().mockReturnValue('amd64')

    await expect(getDownloadUrl('latest')).resolves.toBeTruthy()
  })

  test('get specific version download url', async () => {
    const version = '0.0.26'
    const ops = 'linux'
    const arch = 'amd64'
    const filename = `nucleus_${version}_${ops}_${arch}`

    os.platform = jest.fn().mockReturnValue(ops)

    os.arch = jest.fn().mockReturnValue(arch)

    const url = await getDownloadUrl(version)
    expect(url).toEqual(
      `https://github.com/nucleuscloud/cli/releases/download/v${version}/${filename}.tar.gz`
    )
  })
})
