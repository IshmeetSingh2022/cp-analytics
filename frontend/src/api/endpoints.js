import api from './client'

// ── Auth (/auth) ──────────────────────────────────────────────────
export const authApi = {
  /** POST /auth/signup  →  { message } */
  signup: (username, password) =>
    api.post('/auth/signup', { username, password }),

  /** POST /auth/login  →  { access_token, token_type } */
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
}

// ── User analysis (/user) ─────────────────────────────────────────
export const userApi = {
  /**
   * GET /user/analysis/{handle}
   * → { analysis: { weak, strong, all, top_weak }, progress: [...] }
   */
  getAnalysis: (handle) => api.get(`/user/analysis/${handle}`),

  /**
   * GET /user/progress/{handle}
   * → [{ date, accuracy }, ...]
   */
  getProgress: (handle) => api.get(`/user/progress/${handle}`),
}

// ── Recommendations (/recommend) ─────────────────────────────────
export const recommendApi = {
  /**
   * GET /recommend/{user_id}
   * → [{ id, name, contest_id, index, rating, tags }, ...]
   */
  getRecommendations: (userId) => api.get(`/recommend/${userId}`),
}

// ── Daily stats (/stats) ─────────────────────────────────────────
export const statsApi = {
  /**
   * GET /stats/{user_id}
   * → [{ date, solved, correct }, ...]
   */
  getUserStats: (userId) => api.get(`/stats/${userId}`),
}
