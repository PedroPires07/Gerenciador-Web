import React from 'react'
import { Mail, Lock, LogIn } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthLogin() {
  const nav = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = React.useState('')
  const [pass, setPass]   = React.useState('')

  async function handleLogin() {
    await signIn(email, pass)
    nav('/')
  }

  return (
    <div className="min-h-screen grid place-content-center">
      <div className="w-[520px] max-w-[92vw] card">
        <div className="flex justify-center mb-3">
          <Logo title="Dicionário da Saúde" />
        </div>
        <p className="text-center text-slate-600 -mt-1 mb-6">
          Acesse sua conta para continuar
        </p>

        <div className="space-y-4">
          {/* E-mail */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2.5 text-slate-500">
                <Mail size={18} />
              </span>
              {/* força mais espaço entre ícone e texto */}
              <input
                id="email"
                className="input !pl-12"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <label htmlFor="pass" className="block text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2.5 text-slate-500">
                <Lock size={18} />
              </span>
              {/* idem aqui */}
              <input
                id="pass"
                type="password"
                className="input !pl-12"
                placeholder="Digite sua senha"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button onClick={handleLogin} className="btn w-full mt-6">
          <LogIn size={16} /> Entrar
        </button>

        <div className="text-center mt-4 text-sm">
          <a className="text-slate-600" href="#">Esqueci minha senha</a>
        </div>

        <div className="text-center mt-2 text-sm text-slate-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-emerald-700 font-medium">
            Criar perfil
          </Link>
        </div>
      </div>
    </div>
  )
}
