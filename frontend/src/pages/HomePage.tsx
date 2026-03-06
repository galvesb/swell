import { Link } from 'react-router-dom'

const CATEGORIES = [
  { slug: 'new-in', label: 'New In', img: 'https://images.unsplash.com/photo-1550614000-4b95d4edfa21?auto=format&fit=crop&w=500&q=80' },
  { slug: 'alfaiataria', label: 'Alfaiataria', img: 'https://images.unsplash.com/photo-1515347619362-7dd3e215442e?auto=format&fit=crop&w=500&q=80' },
  { slug: 'roupas', label: 'Roupas', img: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=500&q=80' },
  { slug: 'sale', label: 'Sale', img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=500&q=80' },
]

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: '70vh', minHeight: 400 }}>
        <img
          src="https://images.unsplash.com/photo-1515347619362-7dd3e215442e?auto=format&fit=crop&w=1400&q=80"
          alt="Swell Store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center px-5">
          <h1 className="font-serif text-5xl md:text-7xl font-normal mb-4">Swell Store</h1>
          <p className="text-sm md:text-base font-light tracking-widest mb-8 uppercase">Nova Coleção 2025</p>
          <Link
            to="/categoria/new-in"
            className="border border-white px-10 py-3.5 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Explorar
          </Link>
        </div>
      </section>

      {/* Categories grid */}
      <section className="px-6 md:px-10 py-16">
        <h2 className="font-serif text-2xl text-center mb-10">Nossas Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="group relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                <span className="text-white text-xs uppercase tracking-widest font-medium">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
