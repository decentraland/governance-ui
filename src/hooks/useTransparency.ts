import { useQuery } from '@tanstack/react-query'

import { Transparency } from '../clients/Transparency'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

type Options = {
  shouldRevalidate?: boolean
}

export function useTransparency({ shouldRevalidate }: Options = {}) {
  const { data, isLoading: isLoadingTransparencyData } = useQuery({
    queryKey: ['transparencyData'],
    queryFn: () => Transparency.getData(),
    staleTime: shouldRevalidate ? 0 : DEFAULT_QUERY_STALE_TIME,
  })

  return { data, isLoadingTransparencyData }
}

export function useTransparencyTeams({ shouldRevalidate }: Options = {}) {
  const { data, isLoading: isLoadingTransparencyTeams } = useQuery({
    queryKey: ['transparencyTeams'],
    queryFn: () => Transparency.getTeams(),
    staleTime: shouldRevalidate ? 0 : DEFAULT_QUERY_STALE_TIME,
  })

  return { data, isLoadingTransparencyTeams }
}

export function useTransparencyBalances({ shouldRevalidate }: Options = {}) {
  const { data, isLoading: isLoadingTransparencyBalances } = useQuery({
    queryKey: ['transparencyBalances'],
    queryFn: () => Transparency.getBalances(),
    staleTime: shouldRevalidate ? 0 : DEFAULT_QUERY_STALE_TIME,
  })

  return { data, isLoadingTransparencyBalances }
}

export default useTransparency
