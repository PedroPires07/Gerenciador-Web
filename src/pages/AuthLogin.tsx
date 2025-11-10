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
  const [error, setError] = React.useState('')

  async function handleLogin() {
    try {
      setError('')
      await signIn(email, pass)
      nav('/')
    } catch (err: any) {
      console.error('Erro no login:', err)
      if (err?.code === 'auth/too-many-requests') {
        setError('Muitas tentativas de login. Por favor, aguarde alguns minutos e tente novamente.')
      } else if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.')
      } else if (err?.code === 'auth/user-not-found') {
        setError('Usuário não encontrado.')
      } else if (err?.code === 'auth/invalid-email') {
        setError('E-mail inválido.')
      } else {
        setError('Erro ao fazer login. Por favor, tente novamente.')
      }
    }
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

        <button 
          onClick={handleLogin} 
          className="btn w-full mt-6"
        >
          <LogIn size={16} /> Entrar
        </button>

        {error && (
          <div className="mt-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="text-center mt-4 text-sm">
          <a className="text-slate-600" href="#">Esqueci minha senha</a>
        </div>

        <div className="text-center mt-2 text-sm text-slate-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-purple-700 font-medium">
            Criar perfil
          </Link>
        </div>
      </div>
    </div>
  )
}
