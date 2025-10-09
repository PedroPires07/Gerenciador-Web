// src/pages/Config.tsx
import React from 'react'
import { Layout } from '../components/Layout'
import { authApi } from '../data/repo'

export default function Config() {
  const user = authApi.me()

  const [nome, setNome] = React.useState(user?.displayName ?? '')
  const [email, setEmail] = React.useState(user?.email ?? '')

  // reauth
  const [senhaAtualEmail, setSenhaAtualEmail] = React.useState('')
  const [senhaAtualPwd, setSenhaAtualPwd] = React.useState('')

  // alterar senha
  const [novaSenha, setNovaSenha] = React.useState('')
  const [confirmaSenha, setConfirmaSenha] = React.useState('')

  const [loading, setLoading] = React.useState<string | null>(null)
  const [msg, setMsg] = React.useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  React.useEffect(() => {
    setNome(user?.displayName ?? '')
    setEmail(user?.email ?? '')
  }, [user?.displayName, user?.email])

  function notifyOk(text: string) { setMsg({ type: 'ok', text }); setTimeout(() => setMsg(null), 3500) }
  function notifyErr(e: any) { setMsg({ type: 'err', text: e?.message || String(e) }); setTimeout(() => setMsg(null), 5000) }

  async function salvarNome() {
    try {
      setLoading('nome')
      await authApi.updateName(nome.trim())
      notifyOk('Nome atualizado com sucesso.')
    } catch (e) {
      notifyErr(e)
    } finally { setLoading(null) }
  }

  async function salvarEmail() {
    if (!email.trim()) return
    try {
      setLoading('email')
      // reautentica com a senha atual
      await authApi.reauth(senhaAtualEmail)
      await authApi.updateEmail(email.trim())
      setSenhaAtualEmail('')
      notifyOk('E-mail atualizado com sucesso.')
    } catch (e) {
      notifyErr(e)
    } finally { setLoading(null) }
  }

  async function salvarSenha() {
    if (!novaSenha || novaSenha !== confirmaSenha) {
      notifyErr(new Error('A confirmação de senha não confere.'))
      return
    }
    try {
      setLoading('senha')
      await authApi.reauth(senhaAtualPwd)
      await authApi.updatePassword(novaSenha)
      setSenhaAtualPwd(''); setNovaSenha(''); setConfirmaSenha('')
      notifyOk('Senha atualizada com sucesso.')
    } catch (e) {
      notifyErr(e)
    } finally { setLoading(null) }
  }

  if (!user) {
    return (
      <Layout title="Configurações" subtitle="Gerencie seu perfil e segurança">
        <div className="card">Você precisa estar autenticado.</div>
      </Layout>
    )
  }

  return (
    <Layout title="Configurações" subtitle="Gerencie seu perfil e segurança">
      {msg && (
        <div className={`p-3 rounded-lg ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
          {msg.text}
        </div>
      )}

      {/* Perfil */}
      <div className="card">
        <div className="text-lg font-semibold mb-3">Seu perfil</div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="label">Nome</label>
            <input className="input" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <div className="hidden md:block" />
          <div>
            <label className="label">Confirme sua senha atual para alterar o e-mail</label>
            <input type="password" className="input" placeholder="Senha atual" value={senhaAtualEmail} onChange={e => setSenhaAtualEmail(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={salvarNome} className="btn" disabled={loading === 'nome'}>
            {loading === 'nome' ? 'Salvando...' : 'Salvar nome'}
          </button>
          <button onClick={salvarEmail} className="btn" disabled={loading === 'email'}>
            {loading === 'email' ? 'Salvando...' : 'Salvar e-mail'}
          </button>
        </div>
      </div>

      {/* Segurança */}
      <div className="card">
        <div className="text-lg font-semibold mb-3">Segurança</div>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="label">Senha atual</label>
            <input type="password" className="input" value={senhaAtualPwd} onChange={e => setSenhaAtualPwd(e.target.value)} />
          </div>
          <div>
            <label className="label">Nova senha</label>
            <input type="password" className="input" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
          </div>
          <div>
            <label className="label">Confirmar nova senha</label>
            <input type="password" className="input" value={confirmaSenha} onChange={e => setConfirmaSenha(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={salvarSenha} className="btn" disabled={loading === 'senha'}>
            {loading === 'senha' ? 'Atualizando...' : 'Alterar senha'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
