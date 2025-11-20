import { useState } from 'react'

export default function SellForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const token = localStorage.getItem('mp_token')
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    try {
      const res = await fetch(`${baseUrl}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ title, description, image_url: imageUrl, starting_price: parseFloat(startingPrice) })
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Create failed')
      const data = await res.json()
      onCreated(data)
      setTitle(''); setDescription(''); setImageUrl(''); setStartingPrice('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-4">List an item</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Image URL</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Starting price</label>
          <input type="number" step="0.01" min="0" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} required className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none" />
        </div>
        <div className="flex justify-end">
          <button disabled={loading} className="px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-50">{loading ? 'Listing...' : 'List item'}</button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  )
}
