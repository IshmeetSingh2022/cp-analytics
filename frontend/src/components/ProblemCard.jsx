const TIER_COLOR = (r) => {
  if (!r)      return '#6e7681'
  if (r >= 2400) return '#ff4444'
  if (r >= 2100) return '#ff8c00'
  if (r >= 1900) return '#aa00ff'
  if (r >= 1600) return '#4488ff'
  if (r >= 1400) return '#22c55e'
  return '#44ddcc'
}

/**
 * Single recommended problem card.
 * Props: { problem, rank }
 * problem: { id, name, contest_id, index, rating, tags }
 */
export default function ProblemCard({ problem: p, rank }) {
  const tags    = typeof p.tags === 'string'
    ? p.tags.split(',').map(t => t.trim()).filter(Boolean)
    : (p.tags || [])

  const cfUrl   = `https://codeforces.com/contest/${p.contest_id}/problem/${p.index}`
  const rColor  = TIER_COLOR(p.rating)

  return (
    <div className="card p-5 hover:border-brand-500/30 transition-colors">
      <div className="flex items-start justify-between gap-4">

        {/* Left: rank + name + tags */}
        <div className="flex items-start gap-3">
          <span className="font-mono text-xs text-void-500 mt-0.5 w-5 shrink-0">{rank}.</span>
          <div>
            <a
              href={cfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-semibold text-sm text-void-100 hover:text-brand-400 transition-colors"
            >
              {p.name}
            </a>
            <div className="font-mono text-xs text-void-400 mt-0.5">
              {p.contest_id}{p.index} · Codeforces
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map(t => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: rating badge */}
        {p.rating && (
          <span
            className="rating-badge shrink-0"
            style={{ color: rColor, background: `${rColor}20` }}
          >
            {p.rating}
          </span>
        )}
      </div>
    </div>
  )
}
