import { Link } from 'react-router-dom'

export function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-5">
      <h1 className="font-serif text-5xl mb-4">403</h1>
      <p className="text-swell-text-light mb-8">Você não tem permissão para acessar esta página.</p>
      <Link to="/" className="bg-swell-accent text-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-swell-accent-hover transition-colors">
        Voltar ao Início
      </Link>
    </div>
  )
}
