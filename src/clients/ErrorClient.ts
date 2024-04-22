import { Governance } from './Governance'

export class ErrorClient {
  public static async report(errorMsg: string, extraInfo?: Record<string, unknown>, options?: { sign: boolean }) {
    try {
      await Governance.get().reportErrorToServer(errorMsg, extraInfo, options)
    } catch (e) {
      console.error('Error reporting error', e)
    }
  }
}
