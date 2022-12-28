import * as core from '@actions/core'

export interface Inputs {
  version?: string
  clientId?: string
  clientSecret?: string
  logout: boolean
}

export function getInputs(): Inputs {
  return {
    version: core.getInput('version'),
    clientId: core.getInput('client_id'),
    clientSecret: core.getInput('client_secret'),
    logout: core.getBooleanInput('logout')
  }
}
