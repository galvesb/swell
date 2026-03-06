import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'
import { LogoSvg } from '@/components/layout/LogoSvg'

const NAV = [
  { label: 'Produtos', to: '/admin' },
  { label: 'Editar Site', to: '/admin/site' },
]

export function AdminLayout() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = NAV.map((item) => {
    const isActive =
      item.to === '/admin'
        ? pathname === '/admin'
        : pathname.startsWith(item.to)
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={() => setMenuOpen(false)}
        className={`px-6 py-3 text-sm font-sans transition-colors ${
          isActive
            ? 'border-l-2 border-swell-accent bg-swell-bg text-swell-accent'
            : 'border-l-2 border-transparent text-swell-text-dark hover:text-swell-accent hover:bg-swell-bg'
        }`}
      >
        {item.label}
      </Link>
    )
  })

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-swell-border sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <List size={24} weight="light" />
          </button>
          <Link to="/">
            <LogoSvg className="w-32" />
          </Link>
        </div>
        <span className="text-xs uppercase tracking-widest text-swell-text-light font-sans">
          Painel Admin
        </span>
      </header>

      <div className="flex flex-1">
        {/* Mobile overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Sidebar — desktop: always visible; mobile: slides in */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-56 bg-white z-50 flex flex-col sidebar-transition
            md:static md:w-48 md:z-auto md:translate-x-0 md:border-r md:border-swell-border md:flex-shrink-0
            ${menuOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-swell-border md:hidden">
            <LogoSvg className="w-32" />
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
              <X size={22} weight="light" />
            </button>
          </div>

          <nav className="flex flex-col py-6">
            {navLinks}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-swell-bg overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
