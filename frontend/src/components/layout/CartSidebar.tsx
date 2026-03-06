import { X, Truck, Trash } from '@phosphor-icons/react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

const FREE_SHIPPING_THRESHOLD = 700

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  const subtotal = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[99] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[90%] md:w-[400px] bg-white z-[100] shadow-xl sidebar-transition flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-5 border-b border-swell-border">
          <span className="font-serif text-lg">MINHA SACOLA ({items.length})</span>
          <button onClick={onClose} aria-label="Fechar sacola">
            <X size={20} />
          </button>
        </div>

        {/* Shipping progress */}
        <div className="bg-swell-accent text-white text-center py-2.5 text-xs flex justify-center gap-2 items-center">
          <Truck size={16} />
          {remaining > 0
            ? `Faltam ${formatBRL(remaining)} para ganhar Frete Grátis`
            : 'Você ganhou Frete Grátis! 🎉'}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <p className="text-center text-swell-text-light text-sm mt-10">
              Sua sacola está vazia.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map((item, idx) => (
                <li key={`${item.product_id}-${item.size}-${item.color}-${idx}`} className="flex gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-28 object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 text-xs">
                    <p className="uppercase font-medium mb-1">{item.name}</p>
                    <p className="mb-2 text-swell-text-light">
                      {item.price ? formatBRL(item.price) : '—'}
                    </p>
                    <p className="text-swell-text-light">Tamanho: {item.size} | Cor: {item.color}</p>
                    <div className="inline-flex border border-swell-border items-center mt-2">
                      <button
                        className="px-3 py-1 text-sm"
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)
                            : removeItem(item.product_id, item.size, item.color)
                        }
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm border-x border-swell-border">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-1 text-sm"
                        onClick={() =>
                          updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product_id, item.size, item.color)}
                    aria-label="Remover item"
                  >
                    <Trash size={18} className="text-swell-text-light hover:text-swell-alert transition-colors" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-swell-border px-5 py-5">
            <div className="flex justify-between mb-4 text-sm">
              <span>Subtotal</span>
              <div className="text-right">
                <strong>{formatBRL(subtotal)}</strong>
                {subtotal > 0 && (
                  <p className="text-xs text-swell-text-light">
                    6x de {formatBRL(subtotal / 6)}
                  </p>
                )}
              </div>
            </div>
            <button className="w-full bg-swell-accent hover:bg-swell-accent-hover text-white py-4 uppercase text-sm tracking-wider transition-colors">
              {isAuthenticated ? 'Finalizar Compra' : 'Entrar para Finalizar'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
