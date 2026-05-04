import { useState, useEffect, useCallback } from 'react'
import type { ApiResponse } from '../api/client'

interface UseApiState<T> {
  data:    T | null
  loading: boolean
  error:   string | null
}

export function useApi<T>(fetcher: () => Promise<ApiResponse<T>>) {
  const [state, setState] = useState<UseApiState<T>>({ data: null, loading: true, error: null })

  const execute = useCallback(() => {
    setState(s => ({ ...s, loading: true, error: null }))
    fetcher()
      .then(res => setState({ data: res.data, loading: false, error: null }))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Error desconocido'
        setState({ data: null, loading: false, error: msg })
      })
  }, [fetcher])

  useEffect(() => { execute() }, [execute])

  return { ...state, refetch: execute }
}
