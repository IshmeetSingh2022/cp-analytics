import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token,    setToken]    = useState(() => localStorage.getItem('cp_token'))
  const [username, setUsername] = useState(() => localStorage.getItem('cp_username') || '')
  const [userId,   setUserId]   = useState(() => parseInt(localStorage.getItem('cp_userid') || '1'))

  function login(tok, uname, uid = 1) {
    localStorage.setItem('cp_token',    tok)
    localStorage.setItem('cp_username', uname)
    localStorage.setItem('cp_userid',   String(uid))
    setToken(tok)
    setUsername(uname)
    setUserId(uid)
  }

  function logout() {
    localStorage.removeItem('cp_token')
    localStorage.removeItem('cp_username')
    localStorage.removeItem('cp_userid')
    setToken(null)
    setUsername('')
    setUserId(1)
  }

  return (
    <AuthContext.Provider value={{ token, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
