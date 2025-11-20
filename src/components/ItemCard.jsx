export default function ItemCard({ item, onBid }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200" />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-lg line-clamp-1">{item.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-2 min-h-[40px]">{item.description || 'No description'}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xs text-slate-500">Current bid</p>
            <p className="text-xl font-bold">${(item.current_price ?? item.starting_price).toFixed(2)}</p>
          </div>
          <button onClick={() => onBid(item)} className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700">Bid</button>
        </div>
      </div>
    </div>
  )
}
