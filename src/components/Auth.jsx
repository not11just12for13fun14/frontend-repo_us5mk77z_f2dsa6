import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/signin'
      const body = mode === 'signup' ? { name, email } : { email }
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Request failed')
      const data = await res.json()
      localStorage.setItem('mp_token', data.token)
      localStorage.setItem('mp_user', JSON.stringify({ id: data.user_id, name }))
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-md mx-auto p-6 pt-24">
        <div className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-6">
          <h1 className="text-2xl font-semibold mb-4">{mode === 'signup' ? 'Create account' : 'Sign in'}</h1>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none" />
              </div>
            )}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none" />
            </div>
            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded py-2 font-medium">{loading ? 'Please wait...' : (mode === 'signup' ? 'Sign up' : 'Sign in')}</button>
          </form>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          <div className="mt-4 text-sm text-blue-200">
            {mode === 'signup' ? (
              <button className="underline" onClick={() => setMode('signin')}>Already have an account? Sign in</button>
            ) : (
              <button className="underline" onClick={() => setMode('signup')}>New here? Create an account</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
