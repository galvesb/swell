import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LogoSvg } from '@/components/layout/LogoSvg'

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await register(email, password, fullName)
      navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? 'Erro ao criar conta. Verifique os dados e tente novamente.')
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
          <h1 className="font-serif text-2xl mt-4">Criar Conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5">Nome completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent"
              placeholder="Seu nome"
            />
          </div>
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
              minLength={8}
              className="w-full border border-swell-border px-4 py-3 text-sm focus:outline-none focus:border-swell-accent"
              placeholder="Mín. 8 caracteres"
            />
            <p className="text-[11px] text-swell-text-light mt-1">
              Use letras maiúsculas, números e caracteres especiais.
            </p>
          </div>

          {error && <p className="text-swell-alert text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-swell-accent hover:bg-swell-accent-hover disabled:opacity-60 text-white py-3.5 uppercase text-sm tracking-wider transition-colors"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center text-sm text-swell-text-light mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-swell-accent hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
