import * as core from '@actions/core'

export const IsPost = !!core.getState('isPost')
export const Logout = /true/i.test(core.getState('logout') || '')

export function setLogout(logout: boolean): void {
  core.saveState('logout', logout)
}

if (!IsPost) {
  core.saveState('isPost', 'true')
}
