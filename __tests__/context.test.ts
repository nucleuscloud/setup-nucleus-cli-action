import {expect, test} from '@jest/globals'

import {getInputs} from '../src/context'

describe('context.ts', () => {
  test('getInputs does not throw error', async () => {
    process.env['INPUT_VERSION'] = '0.0.1'
    process.env['INPUT_CLIENT_ID'] = 'client-id'
    process.env['INPUT_CLIENT_SECRET'] = 'client-secret'
    process.env['INPUT_LOGOUT'] = 'true'
    expect(() => {
      getInputs()
    }).not.toThrowError()
  })
})
