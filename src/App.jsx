import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import ItemCard from './components/ItemCard'
import BidModal from './components/BidModal'

function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const fetchItems = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/items`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchItems() }, [])

  const onBidPlaced = (updated) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4 text-slate-900">Browse items</h1>
      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onBid={(it) => setSelected(it)} />
          ))}
        </div>
      )}
      <BidModal open={!!selected} item={selected} onClose={() => setSelected(null)} onPlaced={onBidPlaced} />
    </div>
  )
}

import { Routes, Route } from 'react-router-dom'
import Auth from './components/Auth'
import SellForm from './components/SellForm'

function Sell() {
  const [refreshKey, setRefreshKey] = useState(0)
  const onCreated = () => setRefreshKey((k) => k + 1)
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <SellForm onCreated={onCreated} />
      <Home key={refreshKey} />
    </div>
  )
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      {children}
    </div>
  )
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sell" element={<Sell />} />
      </Routes>
    </Layout>
  )
}

export default App
