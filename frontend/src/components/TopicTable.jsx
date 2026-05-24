import { AccuracyBar } from './UI'

/**
 * Renders a table of { tag, solved, total, accuracy } rows.
 */
export default function TopicTable({ topics = [] }) {
  if (topics.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-void-400 font-mono text-sm">
        No topics in this category
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-void-600 grid grid-cols-12 gap-2
                      font-mono text-xs text-void-400 uppercase tracking-widest">
        <span className="col-span-4">Topic</span>
        <span className="col-span-2 text-right">Solved</span>
        <span className="col-span-2 text-right">Total</span>
        <span className="col-span-4">Accuracy</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-void-700 max-h-[480px] overflow-y-auto scrollbar-thin">
        {topics.map(t => (
          <div
            key={t.tag}
            className="px-5 py-3 grid grid-cols-12 gap-2 items-center hover:bg-void-700/30 transition-colors"
          >
            <span className="col-span-4 font-mono text-xs text-void-100 truncate">{t.tag}</span>
            <span className="col-span-2 text-right font-mono text-xs text-brand-400">{t.solved}</span>
            <span className="col-span-2 text-right font-mono text-xs text-void-400">{t.total}</span>
            <div className="col-span-4">
              <AccuracyBar value={t.accuracy} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
