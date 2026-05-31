// src/pages/ReadinessPage.jsx

import { useState } from 'react'
import { readinessApi } from '../api/endpoints'
import { useFetch } from '../hooks/useFetch'
import HandleSearch from '../components/HandleSearch'
import { Spinner, ErrorBanner, EmptyState } from '../components/UI'

function ScoreCircle({ total, label }) {
  const color =
    total >= 80 ? '#22c55e' :
    total >= 65 ? '#4488ff' :
    total >= 50 ? '#eab308' :
    total >= 30 ? '#ff8c00' :
                  '#ef4444'

  return (
    <div className="card p-8 flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${total * 2.826} 282.6`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display text-4xl font-black"
            style={{ color }}
          >
            {total}
          </span>
          <span className="font-mono text-xs text-void-400">/ 100</span>
        </div>
      </div>
      <span
        className="font-display font-bold text-lg"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  )
}

function FactorBar({ label, score, max }) {
  const percent = Math.round((score / max) * 100)
  const color =
    percent >= 80 ? '#22c55e' :
    percent >= 60 ? '#4488ff' :
    percent >= 40 ? '#eab308' :
                    '#ef4444'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-void-300">{label}</span>
        <span
          className="font-mono text-xs font-bold"
          style={{ color }}
        >
          {score}/{max}
        </span>
      </div>
      <div className="h-2 bg-void-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  )
}

function BreakdownCard({ breakdown }) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <h3 className="font-display font-semibold text-sm">Score Breakdown</h3>
      {Object.values(breakdown).map(factor => (
        <FactorBar
          key={factor.label}
          label={factor.label}
          score={factor.score}
          max={factor.max}
        />
      ))}
    </div>
  )
}

function SuggestionsCard({ suggestions }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <h3 className="font-display font-semibold text-sm">
        What to Improve
      </h3>
      {suggestions.map((s, i) => (
        <div
          key={i}
          className="flex items-start gap-3 px-3 py-2.5 rounded-lg
                     bg-void-800/30 border border-void-700/30"
        >
          <span className="text-brand-400 font-mono text-xs mt-0.5">→</span>
          <span className="font-mono text-xs text-void-200">{s}</span>
        </div>
      ))}
    </div>
  )
}

function WarningBanner({ msg }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg
                    bg-yellow-500/10 border border-yellow-500/20">
      <span className="text-yellow-400">⚠️</span>
      <span className="font-mono text-xs text-yellow-300">{msg}</span>
    </div>
  )
}

export default function ReadinessPage() {
  const [handle, setHandle] = useState('')
  const { data, loading, error, execute } = useFetch(readinessApi.getReadiness)

  async function handleSearch(h) {
    await execute(h)
    setHandle(h)
  }

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="font-display text-2xl font-bold">
          Interview Readiness
        </h1>
        <p className="text-void-300 font-mono text-xs mt-1">
          Your overall interview readiness score based on CF performance
        </p>
      </div>

      <HandleSearch
        onSearch={handleSearch}
        loading={loading}
        placeholder="Codeforces handle (e.g. tourist)"
      />

      {error   && <ErrorBanner msg={error} />}
      {loading && <Spinner />}

      {data && !loading && (
        <div className="space-y-6 animate-slide-up">

          <div className="glass-green rounded-xl px-5 py-3 flex items-center gap-3">
            <span className="text-brand-400 font-mono text-lg">@</span>
            <span className="font-display font-bold text-lg">{handle}</span>
          </div>

          {data.warning && <WarningBanner msg={data.warning} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ScoreCircle
              total={data.total}
              label={data.label}
            />
            <BreakdownCard breakdown={data.breakdown} />
          </div>

          {data.suggestions?.length > 0 && (
            <SuggestionsCard suggestions={data.suggestions} />
          )}

        </div>
      )}

      {!data && !loading && (
        <EmptyState
          icon="◎"
          title="Enter a Codeforces handle to check readiness"
          sub="Scores based on rating, topics, difficulty and consistency"
        />
      )}

    </div>
  )
}