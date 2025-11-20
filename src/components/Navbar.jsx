import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('mp_user')
    if (u) setUser(JSON.parse(u))
  }, [location.pathname])

  const signOut = async () => {
    const token = localStorage.getItem('mp_token')
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    try {
      await fetch(`${baseUrl}/auth/signout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
      })
    } catch {}
    localStorage.removeItem('mp_token')
    localStorage.removeItem('mp_user')
    setUser(null)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block w-7 h-7 rounded bg-blue-600" />
          <span className="text-xl font-bold text-slate-900">BidBay</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded">Browse</Link>
          <Link to="/sell" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded">Sell</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-700 text-sm">Hi, {user.name}</span>
              <button onClick={signOut} className="px-3 py-2 rounded bg-slate-900 text-white hover:bg-slate-700">Sign out</button>
            </div>
          ) : (
            <Link to="/auth" className="px-3 py-2 rounded bg-slate-900 text-white hover:bg-slate-700">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
