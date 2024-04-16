import { config } from '../config'

export const GRANT_VP_THRESHOLD = import.meta.env.VITE_GRANT_VP_THRESHOLD || config.get('GRANT_VP_THRESHOLD') // Testing variable
