import { useState } from 'react'
import { userApi } from '../api/endpoints'
import { useFetch } from '../hooks/useFetch'
import HandleSearch from '../components/HandleSearch'
import TopicTable from '../components/TopicTable'
import { Spinner, ErrorBanner, EmptyState } from '../components/UI'

const VIEWS = [
  { key: 'all',    label: 'All Topics' },
  { key: 'weak',   label: '⚠ Weak'    },
  { key: 'strong', label: '✓ Strong'  },
]

export default function AnalysisPage() {
  const [view, setView] = useState('all')
  const { data, loading, error, execute } = useFetch(
    async (handle) => {
      const res = await userApi.getAnalysis(handle)
      return res.analysis
    }
  )

  const topics = data ? (data[view] || []) : []

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="font-display text-2xl font-bold">Topic Analysis</h1>
        <p className="text-void-300 font-mono text-xs mt-1">
          Deep dive into strong / weak topic performance
        </p>
      </div>

      <HandleSearch onSearch={execute} loading={loading} buttonLabel="Load" />

      {error   && <ErrorBanner msg={error} />}
      {loading && <Spinner />}

      {data && !loading && (
        <div className="space-y-4 animate-slide-up">

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {VIEWS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`btn-ghost px-4 py-1.5 rounded-md text-xs ${
                  view === key ? 'border-brand-500 text-brand-400' : ''
                }`}
              >
                {label}
                <span className="ml-1.5 text-void-500">({(data[key] || []).length})</span>
              </button>
            ))}
          </div>

          <TopicTable topics={topics} />
        </div>
      )}

      {!data && !loading && (
        <EmptyState
          icon="◎"
          title="Enter a handle to see topic breakdown"
          sub="Topics with < 5 attempts are excluded"
        />
      )}
    </div>
  )
}
