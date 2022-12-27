import * as core from '@actions/core'

export const IsPost = !!process.env['STATE_isPost']
export const Logout = /true/i.test(process.env['STATE_logout'] || '')

export function setLogout(logout: boolean): void {
  core.saveState('logout', logout)
}

if (!IsPost) {
  core.saveState('isPost', 'true')
}
