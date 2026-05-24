import axios from 'axios'

const api = axios.create({
  baseURL: '/api',   // Vite proxy rewrites /api → http://localhost:8000
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Unwrap axios errors into plain messages
api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.detail || err.message || 'Request failed'
    return Promise.reject(new Error(msg))
  }
)

export default api
