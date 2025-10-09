import React from 'react'
import { Mail, Lock, LogIn } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthLogin() {
  const nav = useNavigate()
  const { signIn } = useAuth()
  return (
    <div className="min-h-screen grid place-content-center">
      <div className="w-[520px] max-w-[92vw] card">
        <div className="flex justify-center mb-2"><Logo title="Dicionário da Saúde" /></div>
        <div className="text-center text-slate-600 -mt-1 mb-6">Acesse sua conta para continuar</div>

        <label className="block text-sm font-medium mb-1">E-mail</label>
        <div className="relative mb-3">
          <span className="absolute left-3 top-2.5 text-slate-500"><Mail size={16}/></span>
          <input id="email" className="input pl-9" placeholder="seu@email.com"/>
        </div>

        <label className="block text-sm font-medium mb-1">Senha</label>
        <div className="relative mb-5">
          <span className="absolute left-3 top-2.5 text-slate-500"><Lock size={16}/></span>
          <input id="pass" className="input pl-9" placeholder="Digite sua senha" type="password"/>
        </div>

        <button onClick={async()=>{ const email=(document.querySelector('#email') as HTMLInputElement)?.value; const pass=(document.querySelector('#pass') as HTMLInputElement)?.value; await signIn(email,pass); nav('/') }} className="btn w-full"><LogIn size={16}/> Entrar</button>

        <div className="text-center mt-4 text-sm">
          <a className="text-slate-600" href="#">Esqueci minha senha</a>
        </div>

        <div className="text-center mt-2 text-sm text-slate-600">
          Não tem uma conta? <Link to="/register" className="text-emerald-700 font-medium">Criar perfil</Link>
        </div>
      </div>
    </div>
  )
}
