import { useState, useCallback } from 'react'

/**
 * Generic hook that wraps an async API call.
 *
 * const { data, loading, error, execute } = useFetch(userApi.getAnalysis)
 * execute('tourist')
 */
export function useFetch(apiFn) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const result = await apiFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [apiFn])

  const reset = useCallback(() => {
    setData(null)
    setError('')
  }, [])

  return { data, loading, error, execute, reset }
}
