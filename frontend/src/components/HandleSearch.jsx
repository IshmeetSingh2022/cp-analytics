import { useState } from 'react'

/**
 * A controlled handle-search form.
 *
 * Props:
 *   onSearch(handle: string) — called on submit
 *   loading: bool
 *   placeholder?: string
 *   buttonLabel?: string
 */
export default function HandleSearch({
  onSearch,
  loading,
  placeholder = 'Enter Codeforces handle',
  buttonLabel  = 'Analyze',
}) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const h = value.trim()
    if (h) onSearch(h)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        className="terminal-input flex-1 px-4 py-2.5 rounded-md text-sm"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
      <button className="btn-primary px-6 py-2.5 rounded-md text-sm" disabled={loading || !value.trim()}>
        {loading ? '...' : buttonLabel}
      </button>
    </form>
  )
}
