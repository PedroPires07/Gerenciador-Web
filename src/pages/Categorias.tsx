import React from 'react'
import { Layout } from '../components/Layout'
import { categoriasApi } from '../data/repo'
import { Plus, Pencil, Trash2 } from 'lucide-react'

type Area = 'Medicina'|'Odontologia'
type Cat = { id: string; nome: string; area: Area; totalTermos?: number; criadoEm?: string }

export default function Categorias() {
  const [cats, setCats] = React.useState<Cat[]>([])
  const [showNew, setShowNew] = React.useState(false)
  const [novo, setNovo] = React.useState<{ nome: string; area: Area }>({ nome: '', area: 'Medicina' })

  // editar
  const [edit, setEdit] = React.useState<Cat | null>(null)
  // excluir
  const [delId, setDelId] = React.useState<string | null>(null)
  const deleting = delId ? cats.find(c => c.id === delId) : null

  React.useEffect(() => {
    (async () => setCats(await categoriasApi.list()))()
  }, [])

  async function salvarNova() {
    if (!novo.nome.trim()) return
    const created = await categoriasApi.create({ nome: novo.nome.trim(), area: novo.area })
    setCats(prev => [created as Cat, ...prev])
    setShowNew(false)
    setNovo({ nome: '', area: 'Medicina' })
  }

  async function salvarEdicao() {
    if (!edit) return
    const payload = { nome: edit.nome.trim(), area: edit.area }
    await categoriasApi.update(edit.id, payload)
    setCats(prev => prev.map(c => (c.id === edit.id ? { ...c, ...payload } : c)))
    setEdit(null)
  }

  async function confirmarExclusao() {
    if (!delId) return
    await categoriasApi.remove(delId)
    setCats(prev => prev.filter(c => c.id !== delId))
    setDelId(null)
  }

  return (
    <Layout title="Categorias" subtitle="Organize os termos em categorias específicas">
      {/* Cards de resumo */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-sm text-slate-600">Total de Categorias</div>
          <div className="text-3xl font-semibold mt-1">{cats.length}</div>
          <div className="text-slate-500 text-sm mt-1">Categorias ativas</div>
        </div>
        <div className="card text-center">
          <div className="text-sm text-slate-600">Medicina</div>
          <div className="text-3xl font-semibold mt-1">{cats.filter(c => c.area === 'Medicina').length}</div>
          <div className="text-slate-500 text-sm mt-1">Categorias médicas</div>
        </div>
        <div className="card text-center">
          <div className="text-sm text-slate-600">Odontologia</div>
          <div className="text-3xl font-semibold mt-1">{cats.filter(c => c.area === 'Odontologia').length}</div>
          <div className="text-slate-500 text-sm mt-1">Categorias odontológicas</div>
        </div>
      </div>

      {/* Botão nova */}
      <div className="flex justify-end">
        <button onClick={() => setShowNew(true)} className="btn">
          <Plus size={16} /> Nova Categoria
        </button>
      </div>

      {/* Modal Nova Categoria */}
      {showNew && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="card w-[520px] max-w-[95vw]">
            <div className="text-lg font-semibold mb-2">Nova Categoria</div>
            <div className="grid gap-3">
              <input
                className="input"
                placeholder="Nome da categoria"
                value={novo.nome}
                onChange={e => setNovo({ ...novo, nome: e.target.value })}
              />
              <select
                className="select"
                value={novo.area}
                onChange={e => setNovo({ ...novo, area: e.target.value as Area })}
              >
                <option>Medicina</option>
                <option>Odontologia</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowNew(false)} className="border rounded-xl px-4 py-2">
                  Cancelar
                </button>
                <button onClick={salvarNova} className="btn">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="card overflow-x-auto">
        <div className="text-lg font-semibold mb-2">Categorias Cadastradas</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2">Nome</th>
              <th>Área</th>
              <th>Total de Termos</th>
              <th>Criado em</th>
              <th className="text-right pr-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id} className="border-t">
                <td className="py-3">{c.nome}</td>
                <td>
                  <span
                    className={
                      'badge ' +
                      (c.area === 'Medicina' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700')
                    }
                  >
                    {c.area}
                  </span>
                </td>
                <td>{c.totalTermos || 0} {(c.totalTermos || 0) === 1 ? 'termo' : 'termos'}</td>
                <td>{c.criadoEm?.split('-').reverse().join('/')}</td>
                <td className="text-right">
                  <button
                    className="p-2 rounded hover:bg-slate-100"
                    onClick={() => setEdit({ id: c.id, nome: c.nome, area: c.area, totalTermos: c.totalTermos, criadoEm: c.criadoEm })}
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-slate-100"
                    onClick={() => setDelId(c.id)}
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!cats.length && (
              <tr><td colSpan={5} className="py-8 text-center text-slate-500">Nenhuma categoria ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Editar */}
      {edit && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="card w-[520px] max-w-[95vw]">
            <div className="text-lg font-semibold mb-2">Editar Categoria</div>
            <div className="grid gap-3">
              <input
                className="input"
                placeholder="Nome da categoria"
                value={edit.nome}
                onChange={e => setEdit({ ...edit, nome: e.target.value })}
              />
              <select
                className="select"
                value={edit.area}
                onChange={e => setEdit({ ...edit, area: e.target.value as Area })}
              >
                <option>Medicina</option>
                <option>Odontologia</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEdit(null)} className="border rounded-xl px-4 py-2">Cancelar</button>
                <button onClick={salvarEdicao} className="btn">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir */}
      {deleting && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="card w-[520px] max-w-[95vw]">
            <div className="text-lg font-semibold mb-2">Excluir Categoria</div>
            <p className="text-slate-600 mb-4">
              Tem certeza que deseja excluir <b>{deleting.nome}</b>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDelId(null)} className="border rounded-xl px-4 py-2">Cancelar</button>
              <button onClick={confirmarExclusao} className="btn bg-red-600 hover:bg-red-700">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

