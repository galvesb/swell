import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LogoSvg } from '@/components/layout/LogoSvg'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch {
      setError('E-mail ou senha incorretos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-swell-bg flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <LogoSvg className="w-12 mx-auto" />
          </Link>
          <h1 className="font-serif text-2xl mt-4">Entrar</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-swell-alert text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-swell-accent hover:bg-swell-accent-hover disabled:opacity-60 text-white py-3.5 uppercase text-sm tracking-wider transition-colors"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-swell-text-light mt-6">
          Não tem conta?{' '}
          <Link to="/cadastro" className="text-swell-accent hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
