import { useState } from 'react'

export default function BidModal({ open, onClose, item, onPlaced }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open || !item) return null

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const token = localStorage.getItem('mp_token')
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    try {
      const res = await fetch(`${baseUrl}/items/${item.id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ amount: parseFloat(amount) })
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Bid failed')
      const updated = await res.json()
      onPlaced(updated)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-1">Place a bid</h2>
        <p className="text-slate-600 mb-4">{item.title}</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Amount</label>
            <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none" />
            <p className="text-xs text-slate-500 mt-1">Must be greater than ${(item.current_price ?? item.starting_price).toFixed(2)}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button disabled={loading} className="px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-50">{loading ? 'Bidding...' : 'Place bid'}</button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  )
}
