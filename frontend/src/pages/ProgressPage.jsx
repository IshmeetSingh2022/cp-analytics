import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { userApi } from '../api/endpoints'
import { useFetch } from '../hooks/useFetch'
import HandleSearch from '../components/HandleSearch'
import { Spinner, ErrorBanner, StatCard, EmptyState, chartTooltipStyle } from '../components/UI'

export default function ProgressPage() {
  const { data, loading, error, execute } = useFetch(userApi.getProgress)

  const avgAcc = data?.length
    ? data.reduce((s, d) => s + d.accuracy, 0) / data.length
    : 0
  const best = data?.length ? Math.max(...data.map(d => d.accuracy)) : 0

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="font-display text-2xl font-bold">Progress Tracker</h1>
        <p className="text-void-300 font-mono text-xs mt-1">Daily accuracy trends over time</p>
      </div>

      <HandleSearch onSearch={execute} loading={loading} buttonLabel="Load" />

      {error   && <ErrorBanner msg={error} />}
      {loading && <Spinner />}

      {data && !loading && (
        <div className="space-y-5 animate-slide-up">

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Days Active"  value={data.length} />
            <StatCard label="Avg Accuracy" value={`${Math.round(avgAcc * 100)}%`} accent />
            <StatCard label="Best Day"     value={`${Math.round(best  * 100)}%`} />
          </div>

          {/* Line chart */}
          <div className="card p-5">
            <h3 className="font-display font-semibold mb-4 text-sm">Daily Accuracy</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={v => v.slice(5)}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={v => `${Math.round(v * 100)}%`}
                  domain={[0, 1]}
                />
                <Tooltip
                  formatter={v => [`${Math.round(v * 100)}%`, 'Accuracy']}
                  contentStyle={chartTooltipStyle}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Date table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-void-600 grid grid-cols-2
                            font-mono text-xs text-void-400 uppercase tracking-widest">
              <span>Date</span>
              <span className="text-right">Accuracy</span>
            </div>
            <div className="divide-y divide-void-700 max-h-64 overflow-y-auto scrollbar-thin">
              {[...data].reverse().map(d => {
                const color = d.accuracy > 0.7 ? '#22c55e' : d.accuracy > 0.5 ? '#eab308' : '#ef4444'
                return (
                  <div key={d.date} className="px-5 py-2.5 grid grid-cols-2 hover:bg-void-700/30">
                    <span className="font-mono text-xs text-void-200">{d.date}</span>
                    <span className="font-mono text-xs text-right" style={{ color }}>
                      {Math.round(d.accuracy * 100)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {!data && !loading && (
        <EmptyState
          icon="▲"
          title="Track daily accuracy for any handle"
          sub="Requires submissions to have been synced first"
        />
      )}
    </div>
  )
}
