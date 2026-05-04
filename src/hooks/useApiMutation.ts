import { useState, useCallback } from 'react'
import type { ApiResponse } from '../api/client'

interface MutationState<T> {
  data:    T | null
  loading: boolean
  error:   string | null
}

export function useApiMutation<TArgs extends unknown[], TResult>(
  mutationFn: (...args: TArgs) => Promise<ApiResponse<TResult>>
) {
  const [state, setState] = useState<MutationState<TResult>>({ data: null, loading: false, error: null })

  const mutate = useCallback(async (...args: TArgs) => {
    setState({ data: null, loading: true, error: null })
    try {
      const res = await mutationFn(...args)
      setState({ data: res.data, loading: false, error: null })
      return res.data
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setState({ data: null, loading: false, error: msg })
      throw new Error(msg)
    }
  }, [mutationFn])

  return { ...state, mutate }
}
