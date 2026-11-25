import { isBrowserNetworkError, toErrorReportExtraInfo } from '../utils/errors'

import { Governance } from './Governance'

export class ErrorClient {
  public static async report(errorMsg: string, extraInfo?: Record<string, unknown>, options?: { sign: boolean }) {
    // A fetch that never got a response (offline, aborted navigation, ad blocker) isn't actionable from Rollbar.
    // A server that is up but failing still answers with an HTTP status, which surfaces as an APIError instead.
    const reportedError = extraInfo instanceof Error ? extraInfo : extraInfo?.error
    if (isBrowserNetworkError(reportedError)) {
      return
    }

    try {
      await Governance.get().reportErrorToServer(errorMsg, toErrorReportExtraInfo(extraInfo), options)
    } catch (e) {
      console.error('Error reporting error', e)
    }
  }
}
