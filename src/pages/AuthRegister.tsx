import React from 'react'
import { Mail, Lock, UserPlus } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthRegister() {
  const nav = useNavigate()
  const { signUp } = useAuth()
  return (
    <div className="min-h-screen grid place-content-center">
      <div className="w-[560px] max-w-[92vw] card">
        <div className="flex justify-center mb-2"><Logo title="Criar Perfil" /></div>
        <div className="text-center text-slate-600 -mt-1 mb-6">Junte-se ao Dicionário da Saúde</div>

        <label className="block text-sm font-medium mb-1">Nome Completo</label>
        <div className="relative mb-3">
          <span className="absolute left-3 top-2.5 text-slate-500"><UserPlus size={16}/></span>
          <input id="nome" className="input pl-9" placeholder="Digite seu nome completo"/>
        </div>

        <label className="block text-sm font-medium mb-1">E-mail</label>
        <div className="relative mb-3">
          <span className="absolute left-3 top-2.5 text-slate-500"><Mail size={16}/></span>
          <input id="email" className="input pl-9" placeholder="seu@email.com"/>
        </div>

        <label className="block text-sm font-medium mb-1">Senha</label>
        <div className="relative mb-3">
          <span className="absolute left-3 top-2.5 text-slate-500"><Lock size={16}/></span>
          <input id="pass" className="input pl-9" placeholder="Mínimo 6 caracteres" type="password"/>
        </div>

        <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
        <div className="relative mb-4">
          <span className="absolute left-3 top-2.5 text-slate-500"><Lock size={16}/></span>
          <input className="input pl-9" placeholder="Confirme sua senha" type="password"/>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm">
          <input type="checkbox" className="h-4 w-4"/>
          <span>Aceito os <a href="#" className="text-emerald-700">termos de uso</a></span>
        </div>

        <button onClick={async()=>{ const nome=(document.querySelector('#nome') as HTMLInputElement)?.value; const email=(document.querySelector('#email') as HTMLInputElement)?.value; const pass=(document.querySelector('#pass') as HTMLInputElement)?.value; await signUp(nome,email,pass); nav('/') }} className="btn w-full"><UserPlus size={16}/> Criar conta</button>

        <div className="text-center mt-3 text-sm text-slate-600">
          Já tem uma conta? <Link to="/login" className="text-emerald-700 font-medium">Entrar</Link>
        </div>
      </div>
    </div>
  )
}
