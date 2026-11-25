/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react'

import { ErrorClient } from '../clients/ErrorClient'

import useAsyncTask from './useAsyncTask'

jest.mock('../clients/ErrorClient', () => ({ ErrorClient: { report: jest.fn() } }))
jest.mock('./useAnalyticsTrack', () => {
  const track = jest.fn()
  return { __esModule: true, default: () => track }
})

const report = ErrorClient.report as jest.Mock

describe('useAsyncTask', () => {
  beforeEach(() => {
    report.mockReset()
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('reports the thrown error itself so ErrorClient can serialize it', async () => {
    const error = new Error('task failed')
    const { result } = renderHook(() => useAsyncTask(() => Promise.reject(error), []))

    act(() => result.current[1]())

    await waitFor(() => expect(report).toHaveBeenCalledWith('AsyncTask error', { error }))
    await waitFor(() => expect(result.current[0]).toBe(false))
  })

  it('still reports and stops loading when the task rejects with undefined', async () => {
    const { result } = renderHook(() => useAsyncTask(() => Promise.reject(undefined), []))

    act(() => result.current[1]())

    await waitFor(() => expect(report).toHaveBeenCalledWith('AsyncTask error', { error: undefined }))
    await waitFor(() => expect(result.current[0]).toBe(false))
  })
})
