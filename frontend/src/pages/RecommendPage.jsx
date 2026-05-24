import { useState } from 'react'
import { recommendApi } from '../api/endpoints'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../context/AuthContext'
import ProblemCard from '../components/ProblemCard'
import { Spinner, ErrorBanner, EmptyState } from '../components/UI'

export default function RecommendPage() {
  const { userId } = useAuth()
  const [customId, setCustomId] = useState('')
  const { data, loading, error, execute } = useFetch(recommendApi.getRecommendations)

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="font-display text-2xl font-bold">AI Recommendations</h1>
        <p className="text-void-300 font-mono text-xs mt-1">
          Personalised problems ranked by your weak topics and recent failures
        </p>
      </div>

      {/* Action row */}
      <div className="flex gap-3 flex-wrap items-center">
        <button
          className="btn-primary px-6 py-2.5 rounded-md text-sm"
          onClick={() => execute(userId)}
          disabled={loading}
        >
          {loading ? '…' : 'Get My Recommendations'}
        </button>

        {/* Custom user-id lookup */}
        <div className="flex gap-2">
          <input
            className="terminal-input px-3 py-2 rounded-md text-sm w-32"
            value={customId}
            onChange={e => setCustomId(e.target.value)}
            placeholder="User ID"
          />
          <button
            className="btn-ghost px-4 py-2 rounded-md text-sm"
            onClick={() => execute(customId)}
            disabled={!customId.trim() || loading}
          >
            Fetch
          </button>
        </div>
      </div>

      {error   && <ErrorBanner msg={error} />}
      {loading && <Spinner />}

      {data && !loading && (
        <div className="space-y-3 animate-slide-up">
          {data.length === 0 ? (
            <div className="card p-8 text-center text-void-400 font-mono text-sm">
              No recommendations found. Make sure the user exists and has submissions.
            </div>
          ) : (
            data.map((problem, i) => (
              <ProblemCard key={problem.id} problem={problem} rank={i + 1} />
            ))
          )}
        </div>
      )}

      {!data && !loading && (
        <EmptyState
          icon="⬡"
          title="Get AI-curated problems matched to your skill gaps"
          sub="Uses topic accuracy + recent failures to rank problems"
        />
      )}
    </div>
  )
}
