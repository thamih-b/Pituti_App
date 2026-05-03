/**
 * Hook for write operations (POST / PATCH / DELETE).
 * Returns a `mutate` function plus loading/error state.
 *
 * Usage:
 *   const { mutate, loading, error } = useApiMutation(
 *     (dto) => vetsApi.create(dto),
 *     { onSuccess: () => refetch() }
 *   );
 */

import { useState, useCallback } from 'react';
import { ApiError } from '../api/client';

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?:   (error: string) => void;
}

interface UseMutationState<T> {
  mutate:  (arg: unknown) => Promise<T | null>;
  loading: boolean;
  error:   string | null;
}

export function useApiMutation<TArg, TResult>(
  fn: (arg: TArg) => Promise<{ data: TResult }>,
  options?: UseMutationOptions<TResult>,
): UseMutationState<TResult> {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const mutate = useCallback(async (arg: TArg): Promise<TResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(arg);
      options?.onSuccess?.(res.data);
      return res.data;
    } catch (err) {
      const msg = err instanceof ApiError
        ? err.message
        : 'Error inesperado. Inténtalo de nuevo.';
      setError(msg);
      options?.onError?.(msg);
      return null;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn]);

  return { mutate: mutate as UseMutationState<TResult>['mutate'], loading, error };
}
