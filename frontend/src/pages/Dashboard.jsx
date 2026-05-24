import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { userApi } from '../api/endpoints'
import { useFetch } from '../hooks/useFetch'
import HandleSearch from '../components/HandleSearch'
import { Spinner, ErrorBanner, StatCard, AccuracyBar, EmptyState, chartTooltipStyle } from '../components/UI'

export default function Dashboard() {
  const [handle, setHandle] = useState('')
  const { data, loading, error, execute } = useFetch(userApi.getAnalysis)

  async function handleSearch(h) {
    await execute(h)
    setHandle(h)
  }

  const analysis = data?.analysis
  const progress = data?.progress || []
  const topTopics = (analysis?.all || []).slice(-6)   // highest accuracy

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-void-300 font-mono text-xs mt-1">
          Look up any Codeforces handle for instant insights
        </p>
      </div>

      <HandleSearch onSearch={handleSearch} loading={loading} placeholder="Codeforces handle (e.g. tourist)" />

      {error   && <ErrorBanner msg={error} />}
      {loading && <Spinner />}

      {data && !loading && (
        <div className="space-y-6 animate-slide-up">

          {/* Handle banner */}
          <div className="glass-green rounded-xl px-5 py-3 flex items-center gap-3">
            <span className="text-brand-400 font-mono text-lg">@</span>
            <span className="font-display font-bold text-lg">{handle}</span>
            <span className="ml-auto text-void-400 font-mono text-xs">
              {progress.length} active day{progress.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Strong Topics" value={analysis.strong?.length ?? 0} accent />
            <StatCard label="Weak Topics"   value={analysis.weak?.length ?? 0}   sub="Need practice" />
            <StatCard label="Total Tags"    value={analysis.all?.length  ?? 0} />
            <StatCard label="Priority"      value={analysis.top_weak?.length ?? 0} sub="Focus these first" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Accuracy over time */}
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-4 text-sm">Accuracy Over Time</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={progress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickFormatter={v => `${Math.round(v * 100)}%`}
                    domain={[0, 1]}
                  />
                  <Tooltip
                    formatter={v => [`${Math.round(v * 100)}%`, 'Accuracy']}
                    contentStyle={chartTooltipStyle}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Topics bar */}
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-4 text-sm">Top Topics by Accuracy</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={topTopics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={[0, 1]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={v => `${Math.round(v * 100)}%`}
                  />
                  <YAxis type="category" dataKey="tag" tick={{ fontSize: 10 }} width={90} />
                  <Tooltip
                    formatter={v => [`${Math.round(v * 100)}%`, 'Accuracy']}
                    contentStyle={chartTooltipStyle}
                  />
                  <Bar dataKey="accuracy" fill="#22c55e" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority weak topics */}
          {analysis.top_weak?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-4 text-sm text-red-400">
                ⚠ Priority Practice Areas
              </h3>
              <div className="space-y-3">
                {analysis.top_weak.map(t => (
                  <div key={t.tag} className="flex items-center gap-4">
                    <span className="font-mono text-xs text-void-200 w-40 truncate">{t.tag}</span>
                    <div className="flex-1"><AccuracyBar value={t.accuracy} /></div>
                    <span className="font-mono text-xs text-void-400">{t.solved}/{t.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!data && !loading && (
        <EmptyState
          icon="◈"
          title="Enter a Codeforces handle to begin"
          sub="Fetches last 200 submissions in real-time"
        />
      )}
    </div>
  )
}
