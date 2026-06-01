import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { ErrorBanner } from '../components/UI'

const TAGLINE = 'AI-powered competitive programming analytics.'

export default function AuthPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [mode,     setMode]     = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [typed,    setTyped]    = useState('')

  // Typewriter effect
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setTyped(TAGLINE.slice(0, ++i))
      if (i >= TAGLINE.length) clearInterval(id)
    }, 35)
    return () => clearInterval(id)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await authApi.signup(username, password)
      }
      const data = await authApi.login(username, password)
      login(data.access_token, username, data.user_id)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center px-4">

      {/* Hero */}
      <div className="mb-10 text-center animate-slide-up">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-sm bg-brand-500 flex items-center justify-center
                          text-void-900 font-display font-black text-sm">
            CP
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Analytics AI</span>
        </div>
        <p className="font-mono text-void-300 text-sm h-5">
          {typed}<span className="cursor text-brand-400">▋</span>
        </p>
      </div>

      {/* Card */}
      <div className="glass rounded-xl p-8 w-full max-w-sm">

        {/* Mode tabs */}
        <div className="flex mb-6 rounded-md overflow-hidden border border-void-600">
          {['login', 'signup'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-2 font-mono text-xs uppercase tracking-widest transition-colors
                ${mode === m
                  ? 'bg-brand-500 text-void-900 font-bold'
                  : 'text-void-300 hover:text-void-100'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-xs text-void-300 uppercase tracking-widest block mb-1.5">
              Username
            </label>
            <input
              className="terminal-input w-full px-4 py-2.5 rounded-md text-sm"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your_handle"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="font-mono text-xs text-void-300 uppercase tracking-widest block mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="terminal-input w-full px-4 py-2.5 rounded-md text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <ErrorBanner msg={error} />}

          <button
            type="submit"
            className="btn-primary py-2.5 rounded-md text-sm mt-1 w-full"
            disabled={loading}
          >
            {loading
              ? 'Please wait…'
              : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>
      </div>

      <p className="mt-6 font-mono text-xs text-void-400 animate-fade-in">
      API: <span className="text-brand-500">{import.meta.env.VITE_API_URL || 'http://localhost:8000'}</span>
      </p>
    </div>
  )
}
