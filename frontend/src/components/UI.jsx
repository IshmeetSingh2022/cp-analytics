// ─── Spinner ──────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// ─── ErrorBanner ─────────────────────────────────────────────────
export function ErrorBanner({ msg }) {
  return (
    <div className="card-green p-3 text-red-400 font-mono text-sm flex items-start gap-2">
      <span className="text-red-500 mt-0.5">✕</span>
      <span>{msg}</span>
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className={`card p-5 flex flex-col gap-1 ${accent ? 'glass-green' : ''}`}>
      <span className="text-void-300 font-mono text-xs uppercase tracking-widest">{label}</span>
      <span className={`text-3xl font-bold font-display ${accent ? 'text-brand-400' : 'text-void-100'}`}>
        {value}
      </span>
      {sub && <span className="text-void-400 font-mono text-xs">{sub}</span>}
    </div>
  )
}

// ─── AccuracyBar ─────────────────────────────────────────────────
export function AccuracyBar({ value }) {
  const pct   = Math.round(value * 100)
  const color = value > 0.7 ? '#22c55e' : value > 0.5 ? '#eab308' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-void-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full progress-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="font-mono text-xs w-8 text-right" style={{ color }}>
        {pct}%
      </span>
    </div>
  )
}

// ─── RatingBadge ─────────────────────────────────────────────────
const TIERS = [
  { min: 2400, color: '#ff4444', bg: 'rgba(255,68,68,0.15)' },
  { min: 2100, color: '#ff8c00', bg: 'rgba(255,140,0,0.15)' },
  { min: 1900, color: '#aa00ff', bg: 'rgba(170,0,255,0.15)' },
  { min: 1600, color: '#4488ff', bg: 'rgba(68,136,255,0.15)' },
  { min: 1400, color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  { min: 1200, color: '#44ddcc', bg: 'rgba(68,221,204,0.15)' },
  { min: 0,    color: '#6e7681', bg: 'rgba(110,118,129,0.15)' },
]

export function RatingBadge({ rating }) {
  const tier = TIERS.find(t => rating >= t.min) || TIERS[TIERS.length - 1]
  return (
    <span className="rating-badge" style={{ color: tier.color, background: tier.bg }}>
      {rating}
    </span>
  )
}

// ─── EmptyState ──────────────────────────────────────────────────
export function EmptyState({ icon, title, sub }) {
  return (
    <div className="card rounded-xl p-12 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-display text-void-300">{title}</p>
      {sub && <p className="font-mono text-void-500 text-xs mt-2">{sub}</p>}
    </div>
  )
}

// ─── HandleSearchBar ─────────────────────────────────────────────
export function HandleSearchBar({ onSubmit, loading, placeholder = 'Codeforces handle' }) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex gap-3"
    >
      {/* input rendered by parent so it can hold state */}
      {onSubmit._input}
    </form>
  )
}

// ─── TooltipStyle (shared recharts tooltip style) ────────────────
export const chartTooltipStyle = {
  background:  '#0d1117',
  border:      '1px solid #21262d',
  fontFamily:  'Space Mono, monospace',
  fontSize:    11,
  color:       '#e6edf3',
}
