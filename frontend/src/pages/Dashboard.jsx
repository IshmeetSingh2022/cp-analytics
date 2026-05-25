import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { userApi } from '../api/endpoints'
import { useFetch } from '../hooks/useFetch'
import HandleSearch from '../components/HandleSearch'
import { Spinner, ErrorBanner, StatCard, AccuracyBar, EmptyState, chartTooltipStyle } from '../components/UI'

// ─────────────────────────────────────────────────────────────────
// 🔥 STREAK CALCULATOR
// progress array lo → kitne consecutive days active rahe count karo
// ─────────────────────────────────────────────────────────────────
function calcStreak(progress) {
  // Agar koi data nahi toh 0 return karo
  if (!progress.length) return 0

  // Sabhi dates ko ek Set mein daalo — O(1) lookup ke liye
  // Set mein: { "2024-01-01", "2024-01-02", ... }
  const dateSet = new Set(progress.map(p => p.date))

  // Aaj ki date string banao: "2024-05-25" format mein
  const today = new Date().toISOString().slice(0, 10)

  let streak = 0
  // Aaj se peeche jaate hain — ek ek din check karte hain
  let check = new Date()

  while (true) {
    // Current date ko "YYYY-MM-DD" string mein convert karo
    const key = check.toISOString().slice(0, 10)

    // Agar is date pe activity hai Set mein
    if (dateSet.has(key)) {
      streak++                        // streak badhao
      check.setDate(check.getDate() - 1)  // ek din peeche jao
    } else {
      // Agar aaj ki date miss hai, kal check karo (ho sakta aaj submit na kiya ho)
      if (key === today) {
        check.setDate(check.getDate() - 1)
        continue
      }
      break  // chain toot gayi — loop band karo
    }
  }

  return streak
}

// ─────────────────────────────────────────────────────────────────
// 📅 HEATMAP DATA BUILDER
// Last 52 weeks ka grid banao (GitHub style)
// Output: array of { date, solved, level }
// level 0-4 → color intensity ke liye
// ─────────────────────────────────────────────────────────────────
function buildHeatmapGrid(progress) {
  // progress ko ek map banao: { "2024-01-01": accuracy_value }
  const map = {}
  progress.forEach(p => { map[p.date] = p.accuracy })

  const today = new Date()
  const cells = []

  // 364 days peeche se aaj tak — 52 weeks * 7 days
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)                    // i days peeche ki date
    const key = d.toISOString().slice(0, 10)      // "YYYY-MM-DD"
    const accuracy = map[key]                      // us date ki accuracy (ya undefined)

    // level decide karo — color intensity ke liye (0=empty, 4=darkest green)
    let level = 0
    if (accuracy !== undefined) {
      if (accuracy >= 0.8)      level = 4   // 80%+ → darkest green
      else if (accuracy >= 0.6) level = 3
      else if (accuracy >= 0.4) level = 2
      else                      level = 1   // kuch bhi kiya → lightest green
    }

    cells.push({ date: key, accuracy, level })
  }

  return cells  // 364 cells ka array
}

// ─────────────────────────────────────────────────────────────────
// 🟩 HEATMAP COMPONENT
// GitHub-style contribution grid — 52 columns x 7 rows
// ─────────────────────────────────────────────────────────────────

// Har level ke liye color — 0 = no activity, 4 = best day
const LEVEL_COLORS = [
  'bg-void-800',        // level 0 — empty/grey
  'bg-brand-900',       // level 1 — bahut halka green
  'bg-brand-700',       // level 2
  'bg-brand-500',       // level 3
  'bg-brand-400',       // level 4 — brightest
]

function Heatmap({ progress }) {
  // 364 cells ka flat array banao
  const cells = buildHeatmapGrid(progress)

  // Flat array ko 52 columns mein todho — har column ek week hai (7 days)
  // [[day0..day6], [day7..day13], ...]
  const weeks = []
  for (let w = 0; w < 52; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7))  // 7-7 ka chunk lo
  }

  // Tooltip ke liye — hover pe konsi cell show ho
  const [tooltip, setTooltip] = useState(null)
  // { date, accuracy, x, y } — mouse position bhi store karo

  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold mb-4 text-sm">
        Activity Heatmap
        <span className="text-void-400 font-mono text-xs ml-2">(last 52 weeks)</span>
      </h3>

      {/* Heatmap grid — relative taaki tooltip absolute position ho sake */}
      <div className="relative overflow-x-auto">
        <div className="flex gap-[3px]">
          {/* Har week ek column hai — vertically 7 cells */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {/* Har cell ek din hai */}
              {week.map((cell, di) => (
                <div
                  key={di}
                  // Level ke hisaab se color class pick karo
                  className={`w-[10px] h-[10px] rounded-[2px] cursor-default transition-opacity hover:opacity-70 ${LEVEL_COLORS[cell.level]}`}
                  // Mouse enter pe tooltip show karo
                  onMouseEnter={e => setTooltip({
                    date: cell.date,
                    accuracy: cell.accuracy,
                    // Mouse ki screen position
                    x: e.clientX,
                    y: e.clientY,
                  })}
                  // Mouse nikle toh tooltip hide karo
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Tooltip — fixed position pe mouse ke paas dikhao */}
        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none glass rounded-md px-3 py-2 text-xs font-mono shadow-lg"
            style={{
              // Mouse se thoda upar aur daayein dikhao
              left: tooltip.x + 12,
              top: tooltip.y - 40,
            }}
          >
            {/* Date dikhao */}
            <p className="text-void-300">{tooltip.date}</p>
            {/* Accuracy ho toh dikhao, nahi toh "No activity" */}
            <p className="text-brand-400">
              {tooltip.accuracy !== undefined
                ? `${Math.round(tooltip.accuracy * 100)}% accuracy`
                : 'No activity'}
            </p>
          </div>
        )}
      </div>

      {/* Legend — level 0 se 4 tak color strip dikhao */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-void-500 font-mono text-[10px]">Less</span>
        {LEVEL_COLORS.map((cls, i) => (
          <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${cls}`} />
        ))}
        <span className="text-void-500 font-mono text-[10px]">More</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// 🔥 STREAK CARD COMPONENT
// Current streak + max streak dikhao
// ─────────────────────────────────────────────────────────────────
function StreakCard({ progress }) {
  const streak = calcStreak(progress)

  // Max streak calculate karo — pure array mein longest consecutive run
  let maxStreak = 0
  let run = 0
  // Dates sort karo chronologically
  const sorted = [...progress].sort((a, b) => a.date.localeCompare(b.date))

  sorted.forEach((p, i) => {
    if (i === 0) { run = 1; return }  // pehli entry — run shuru karo

    const prev = new Date(sorted[i - 1].date)
    const curr = new Date(p.date)
    // Difference kitne days ka hai?
    const diff = (curr - prev) / (1000 * 60 * 60 * 24)  // ms → days

    if (diff === 1) {
      run++  // consecutive day — run badhao
    } else {
      run = 1  // gap aa gaya — run reset karo
    }

    if (run > maxStreak) maxStreak = run  // max update karo
  })
  // Edge case: agar sirf ek entry hai
  if (sorted.length === 1) maxStreak = 1

  return (
    <div className="card p-5 flex items-center gap-6">
      {/* Fire emoji + current streak number */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔥</span>
        <div>
          <p className="font-display text-3xl font-black text-brand-400">
            {streak}
          </p>
          <p className="font-mono text-xs text-void-400">Current Streak</p>
        </div>
      </div>

      {/* Divider line */}
      <div className="w-px h-12 bg-void-700" />

      {/* Max streak */}
      <div>
        <p className="font-display text-2xl font-bold text-void-200">
          {maxStreak}
        </p>
        <p className="font-mono text-xs text-void-400">Best Streak</p>
      </div>

      {/* Active days total */}
      <div className="ml-auto text-right">
        <p className="font-display text-lg font-semibold text-void-300">
          {progress.length}
        </p>
        <p className="font-mono text-xs text-void-400">Active Days</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// 📊 MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [handle, setHandle] = useState('')
  const { data, loading, error, execute } = useFetch(userApi.getAnalysis)

  async function handleSearch(h) {
    await execute(h)
    setHandle(h)
  }

  const analysis = data?.analysis
  const progress = data?.progress || []          // [{ date, accuracy }]
  const topTopics = (analysis?.all || []).slice(-6)

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-void-300 font-mono text-xs mt-1">
          Look up any Codeforces handle for instant insights
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

          {/* 🔥 NEW — Streak Card */}
          {progress.length > 0 && <StreakCard progress={progress} />}

          {/* 🟩 NEW — Heatmap */}
          {progress.length > 0 && <Heatmap progress={progress} />}

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
