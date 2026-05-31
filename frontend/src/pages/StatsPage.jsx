import { useEffect } from 'react'
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { statsApi } from '../api/endpoints'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../context/AuthContext'
import { Spinner, ErrorBanner, StatCard, EmptyState, chartTooltipStyle } from '../components/UI'

export default function StatsPage() {
  const { userId } = useAuth()
  const { data, loading, error, execute } = useFetch(statsApi.getUserStats)

  useEffect(() => { execute(userId) }, [userId])

  const totalCorrect  = data?.reduce((s, d) => s + d.correct, 0) ?? 0
  const totalAttempts = data?.reduce((s, d) => s + d.solved,  0) ?? 0
  const overallAcc    = totalAttempts ? totalCorrect / totalAttempts : 0

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="font-display text-2xl font-bold">My Stats</h1>
        <p className="text-void-300 font-mono text-xs mt-1">
          Your registered daily statistics · User ID: <span className="text-brand-400">{userId}</span>
        </p>
      </div>

      {loading && <Spinner />}
      {error   && <ErrorBanner msg={error} />}

      {data && !loading && (
        <div className="space-y-5 animate-slide-up">

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Days Tracked"  value={data.length} />
            <StatCard label="Total Solved"  value={totalCorrect} accent />
            <StatCard label="Overall Acc."  value={`${Math.round(overallAcc * 100)}%`} />
          </div>

          {data.length === 0 ? (
            <div className="card p-8 text-center text-void-400 font-mono text-sm">
              No stats yet — submit solutions to start tracking!
            </div>
          ) : (
            <>
              {/* Bar chart */}
              <div className="card p-5">
                <h3 className="font-display font-semibold mb-4 text-sm">
                  Daily Solved vs Attempted
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={v => v.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="solved"  name="Attempted" fill="#30363d" radius={[3,3,0,0]} />
                    <Bar dataKey="correct" name="Solved"    fill="#22c55e" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-void-600 grid grid-cols-3
                                font-mono text-xs text-void-400 uppercase tracking-widest">
                  <span>Date</span>
                  <span className="text-center">Solved</span>
                  <span className="text-right">Attempted</span>
                </div>
                <div className="divide-y divide-void-700 max-h-64 overflow-y-auto scrollbar-thin">
                  {[...data].reverse().map(d => (
                    <div key={d.date} className="px-5 py-2.5 grid grid-cols-3 hover:bg-void-700/30">
                      <span className="font-mono text-xs text-void-200">{d.date}</span>
                      <span className="font-mono text-xs text-brand-400 text-center">{d.correct}</span>
                      <span className="font-mono text-xs text-void-400 text-right">{d.solved}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {!data && !loading && !error && (
        <EmptyState icon="▬" title="Your daily stats will appear here" />
      )}
    </div>
  )
}