import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('adminSession')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.username) setAdmin(parsed)
      } catch (_) {
        localStorage.removeItem('adminSession')
      }
    }
  }, [])

  const login = (username, password) => {

    if (username === 'admin' && password === 'admin123') {
      const session = { username: 'admin' }
      localStorage.setItem('adminSession', JSON.stringify(session))
      setAdmin(session)
      return { ok: true }
    }
    return { ok: false, message: 'Sai tài khoản hoặc mật khẩu' }
  }

  const logout = () => {
    localStorage.removeItem('adminSession')
    setAdmin(null)
  }

  const value = useMemo(() => ({ admin, login, logout, isAuthenticated: !!admin }), [admin])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('')
  return ctx
}

export default AuthContext


