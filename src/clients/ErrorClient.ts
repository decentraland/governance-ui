import { Governance } from './Governance'

export class ErrorClient {
  public static report(errorMsg: string, extraInfo?: Record<string, unknown>) {
    try {
      Governance.get().reportErrorToServer(errorMsg, extraInfo)
    } catch (e) {
      console.error('Error reporting error', e)
    }
  }
}
