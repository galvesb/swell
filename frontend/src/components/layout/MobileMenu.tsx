import { Link } from 'react-router-dom'
import { X, User, MagnifyingGlass, Tote, Plus } from '@phosphor-icons/react'
import { useCartStore } from '@/store/cartStore'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenCart: () => void
}

const NAV_LINKS = [
  { label: 'NEW IN', hasDropdown: true, alert: 'novo!' },
  { label: 'OCASIÕES', hasDropdown: true },
  { label: 'COLEÇÕES', hasDropdown: true },
  { label: 'BEST SELLERS', hasDropdown: false },
  { label: 'ROUPAS', hasDropdown: true },
  { label: 'ÚLTIMAS PEÇAS', hasDropdown: false, alert: 'vai acabar!' },
  { label: 'SALE', hasDropdown: true },
  { label: 'SOBRE', hasDropdown: true },
]

export function MobileMenu({ isOpen, onClose, onOpenCart }: MobileMenuProps) {
  const totalItems = useCartStore((s) => s.totalItems())

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[99] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[90%] max-w-[350px] bg-white z-[100] overflow-y-auto shadow-xl sidebar-transition ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Top bar */}
        <div className="flex justify-between items-center px-5 py-4 relative">
          <div className="flex gap-4 items-center">
            <button onClick={onClose} aria-label="Fechar menu">
              <X size={24} weight="light" />
            </button>
            <Link to="/login" onClick={onClose}>
              <User size={24} weight="light" />
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <MagnifyingGlass size={24} weight="light" />
            <button
              className="relative"
              onClick={() => { onClose(); onOpenCart() }}
              aria-label="Sacola"
            >
              <Tote size={24} weight="light" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-1.5 bg-swell-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Meus Pedidos banner */}
        <div className="mx-5 mb-5 bg-swell-accent text-white text-center py-4 text-sm font-normal tracking-wide">
          Meus Pedidos
        </div>

        {/* Nav links */}
        <ul className="px-5 pb-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="border-b border-swell-border last:border-b-0">
              <Link
                to={`/categoria/${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center py-4 text-sm font-light text-[#444] tracking-wider"
                onClick={onClose}
              >
                <span className="flex-1">{link.label}</span>
                {link.alert && (
                  <span className="text-swell-alert text-[11px] lowercase italic mr-4">
                    {link.alert}
                  </span>
                )}
                {link.hasDropdown && <Plus size={16} className="text-[#999]" />}
              </Link>
            </li>
          ))}
        </ul>

        {/* Collection image */}
        <div className="px-5 pb-5">
          <img
            src="https://images.unsplash.com/photo-1515347619362-7dd3e215442e?auto=format&fit=crop&w=400&q=80"
            alt="Coleção"
            className="w-full h-48 object-cover"
          />
        </div>
      </div>
    </>
  )
}
