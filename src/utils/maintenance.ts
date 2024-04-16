import { config } from '../config'

export function isUnderMaintenance() {
  switch (config.get('MAINTENANCE')) {
    case 'true':
    case '1':
      return true
    default:
      return false
  }
}
