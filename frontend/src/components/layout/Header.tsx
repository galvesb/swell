import { Link } from 'react-router-dom'
import {
  List,
  User,
  Heart,
  MagnifyingGlass,
  Tote,
  CaretDown,
} from '@phosphor-icons/react'
import { LogoSvg } from './LogoSvg'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

interface HeaderProps {
  onOpenMenu: () => void
  onOpenCart: () => void
}

const NAV_LINKS = [
  { label: 'New In', hasDropdown: true, tag: 'new_in' },
  { label: 'Ocasiões', hasDropdown: true },
  { label: 'Coleções', hasDropdown: true },
  { label: 'Best Sellers', hasDropdown: false },
  { label: 'Roupas', hasDropdown: true },
  { label: 'Últimas Peças', hasDropdown: false },
  { label: 'Sale', hasDropdown: true },
  { label: 'Sobre', hasDropdown: true },
]

export function Header({ onOpenMenu, onOpenCart }: HeaderProps) {
  const totalItems = useCartStore((s) => s.totalItems())
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  const user = useAuthStore((s) => s.user)


  return (
    <header className="flex items-center justify-between px-10 py-5 bg-white border-b border-swell-border sticky top-0 z-50">
      {/* Mobile left */}
      <div className="flex gap-4 items-center text-2xl font-light md:hidden">
        <button onClick={onOpenMenu} aria-label="Menu">
          <List size={24} weight="light" />
        </button>
        <Link to={isAuthenticated ? '/conta' : '/login'}>
          <User size={24} weight="light" />
        </Link>
      </div>

      {/* Desktop logo */}
      <Link to="/" className="hidden md:block">
        <LogoSvg />
      </Link>

      {/* Mobile logo (centered) */}
      <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:hidden">
        <LogoSvg className="w-32" />
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex gap-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            to={`/categoria/${link.label.toLowerCase().replace(' ', '-')}`}
            className="flex items-center gap-1 text-xs uppercase tracking-wider font-normal text-swell-text-dark hover:text-swell-accent transition-colors"
          >
            {link.label}
            {link.hasDropdown && <CaretDown size={12} />}
          </Link>
        ))}
      </nav>

      {/* Icons */}
      <div className="flex gap-5 items-center">
        <Heart size={24} weight="light" className="hidden md:block cursor-pointer hover:text-swell-accent transition-colors" />
        <MagnifyingGlass size={24} weight="light" className="cursor-pointer hover:text-swell-accent transition-colors" />
        <Link to={isAuthenticated ? '/conta' : '/login'} className="hidden md:block">
          <User size={24} weight="light" className="hover:text-swell-accent transition-colors" />
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="hidden md:block text-xs uppercase tracking-wider text-swell-accent font-medium">
            Admin
          </Link>
        )}
        <button
          onClick={onOpenCart}
          className="relative flex items-center"
          aria-label="Abrir sacola"
        >
          <Tote size={24} weight="light" className="hover:text-swell-accent transition-colors" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-1.5 bg-swell-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
