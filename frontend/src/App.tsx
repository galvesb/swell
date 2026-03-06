import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { CartSidebar } from '@/components/layout/CartSidebar'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { AdminRoute } from '@/components/ui/AdminRoute'
import { HomePage } from '@/pages/HomePage'
import { CategoryPage } from '@/pages/CategoryPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminProductForm } from '@/pages/admin/AdminProductForm'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { SiteSettingsPage } from '@/pages/admin/SiteSettingsPage'
import { useSettingsStore } from '@/store/settingsStore'

function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <Header
        onOpenMenu={() => setMenuOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenCart={() => { setMenuOpen(false); setCartOpen(true) }}
      />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  const init = useSettingsStore((s) => s.init)
  useEffect(() => { init() }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public with layout */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/categoria/:category" element={<Layout><CategoryPage /></Layout>} />
        <Route path="/produto/:slug" element={<Layout><ProductDetailPage /></Layout>} />

        {/* Auth pages (no header) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/403" element={<ForbiddenPage />} />

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/produtos/:id" element={<AdminProductForm />} />
            <Route path="/admin/site" element={<SiteSettingsPage />} />
          </Route>
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/conta" element={<Layout><div className="p-10 font-serif text-2xl">Minha Conta</div></Layout>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="font-serif text-5xl mb-4">404</h1>
            <p className="text-swell-text-light">Página não encontrada.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
