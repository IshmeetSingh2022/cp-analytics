import axios from 'axios'

// Axios ka ek instance bana rahe hain
// baseURL '/api' hai jo Vite proxy se localhost:8000 pe jaata hai
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : '/api',
  headers: { 'Content-Type': 'application/json' },
})
// Request interceptor — har request se pehle chalta hai
// localStorage se token nikaalkar Authorization header mein daalte hain
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — har response ke baad chalta hai
// Agar 401 aaya (token expired/invalid) toh localStorage clean karke login page pe bhej do
api.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      // Token expire ho gaya — sab kuch saaf karo
      localStorage.removeItem('cp_token')
      localStorage.removeItem('cp_username')
      localStorage.removeItem('cp_userid')
      // Page reload karega toh App.jsx mein token null milega → /login redirect
      window.location.href = '/login'
    }
    const msg = err.response?.data?.detail || err.message || 'Request failed'
    return Promise.reject(new Error(msg))
  }
)

export default api