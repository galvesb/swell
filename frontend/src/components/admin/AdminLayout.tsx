import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { List, X, CaretDown } from '@phosphor-icons/react'
import { LogoSvg } from '@/components/layout/LogoSvg'

const SITE_SUBNAV = [
  { label: 'Geral', to: '/admin/site' },
  { label: 'Categorias', to: '/admin/site/categorias' },
]

export function AdminLayout() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isSiteSection = pathname.startsWith('/admin/site')
  const [siteExpanded, setSiteExpanded] = useState(isSiteSection)

  const navLinkClass = (to: string, exact = false) => {
    const isActive = exact ? pathname === to : pathname.startsWith(to)
    return `px-6 py-3 text-sm font-sans transition-colors ${
      isActive
        ? 'border-l-2 border-swell-accent bg-swell-bg text-swell-accent'
        : 'border-l-2 border-transparent text-swell-text-dark hover:text-swell-accent hover:bg-swell-bg'
    }`
  }

  const navLinks = (
    <>
      <Link
        to="/admin"
        onClick={() => setMenuOpen(false)}
        className={navLinkClass('/admin', true)}
      >
        Produtos
      </Link>
      <button
        onClick={() => setSiteExpanded((v) => !v)}
        className={`px-6 py-3 text-sm font-sans transition-colors flex items-center justify-between w-full text-left ${
          isSiteSection
            ? 'border-l-2 border-swell-accent text-swell-accent'
            : 'border-l-2 border-transparent text-swell-text-dark hover:text-swell-accent hover:bg-swell-bg'
        }`}
      >
        Editar Site
        <CaretDown
          size={14}
          className={`transition-transform ${siteExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      {siteExpanded && (
        <div className="flex flex-col">
          {SITE_SUBNAV.map((sub) => (
            <Link
              key={sub.to}
              to={sub.to}
              onClick={() => setMenuOpen(false)}
              className={`pl-10 pr-6 py-2.5 text-xs font-sans transition-colors ${
                pathname === sub.to
                  ? 'text-swell-accent bg-swell-bg'
                  : 'text-swell-text-light hover:text-swell-accent hover:bg-swell-bg'
              }`}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )

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
