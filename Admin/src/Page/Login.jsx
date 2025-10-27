import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext.jsx'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const onSubmit = (e) => {
    e.preventDefault()
    const result = login(username.trim(), password)
    if (result.ok) {
      navigate('/admin', { replace: true })
    } else {
      setError(result.message || 'Đăng nhập thất bại')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white shadow rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Đăng nhập quản trị</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="space-y-1">
          <label className="text-sm">Tài khoản</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="admin" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="admin123" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">Đăng nhập</button>
        <div className="text-center">
          <button 
            type="button" 
            onClick={() => navigate('/home')} 
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Xem sản phẩm (không cần đăng nhập)
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login


