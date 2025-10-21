import React, { useMemo, useState } from 'react'
import { Layout } from '../components/Layout'
import { categoriasApi, termosApi } from '../data/repo'
import { Plus, CheckCircle2, Hourglass, Edit2, Trash2 } from 'lucide-react'

type Area = 'Medicina' | 'Odontologia'
type Status = 'Verificado' | 'Pendente'

export default function Termos() {
  const [busca, setBusca] = useState('')
  const [area, setArea] = useState<'Todas' | Area>('Todas')
  const [categoria, setCategoria] = useState('Todas')
  const [status, setStatus] = useState<'Todos' | Status>('Todos')

  const [categorias, setCategorias] = useState<any[]>([])
  const [termos, setTermos] = useState<any[]>([])

  const [showNew, setShowNew] = useState(false)
  const [novo, setNovo] = useState({
    cientifico: '',
    populares: '',
    area: 'Medicina',
    categoria: '',
    status: 'Pendente' as Status,
  })

  const [edit, setEdit] = useState<null | {
    id: string
    cientifico: string
    populares: string
    area: Area
    categoria: string
    status: Status
  }>(null)

  const [delId, setDelId] = useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      setCategorias(await categoriasApi.list())
      setTermos(await termosApi.list())
    })()
  }, [])

  async function salvarNovo() {
    if (!novo.cientifico.trim() || !novo.categoria) return
    const atualizadoEm = new Date().toISOString().slice(0, 10)
    const term = await termosApi.create({
      cientifico: novo.cientifico.trim(),
      populares: novo.populares ? novo.populares.split(',').map(s => s.trim()).filter(Boolean) : [],
      area: novo.area as Area,
      categoria: novo.categoria,
      status: novo.status,
      atualizadoEm,
    } as any)
    setTermos(prev => [term, ...prev])
    setShowNew(false)
    setNovo({ cientifico: '', populares: '', area: 'Medicina', categoria: '', status: 'Pendente' })
  }

  function abrirEdicao(t: any) {
    setEdit({
      id: t.id,
      cientifico: t.cientifico ?? '',
      populares: Array.isArray(t.populares) ? t.populares.join(', ') : '',
      area: t.area,
      categoria: t.categoria ?? '',
      status: t.status,
    })
  }

  async function salvarEdicao() {
    if (!edit) return
    const atualizadoEm = new Date().toISOString().slice(0, 10)
    const patch = {
      cientifico: edit.cientifico.trim(),
      populares: edit.populares ? edit.populares.split(',').map(s => s.trim()).filter(Boolean) : [],
      area: edit.area,
      categoria: edit.categoria,
      status: edit.status,
      atualizadoEm,
    }
    await termosApi.update(edit.id, patch as any)
    setTermos(prev => prev.map(t => (t.id === edit.id ? { ...t, ...patch } : t)))
    setEdit(null)
  }

  async function confirmarExclusao() {
    if (!delId) return
    await termosApi.remove(delId)
    setTermos(prev => prev.filter(t => t.id !== delId))
    setDelId(null)
  }

  const filtrados = useMemo(() => {
    return termos.filter(t =>
      (busca
        ? (t.cientifico ?? '').toLowerCase().includes(busca.toLowerCase()) ||
          (Array.isArray(t.populares) &&
            t.populares.some((p: string) => (p ?? '').toLowerCase().includes(busca.toLowerCase())))
        : true) &&
      (area === 'Todas' ? true : t.area === area) &&
      (categoria === 'Todas' ? true : t.categoria === categoria) &&
      (status === 'Todos' ? true : t.status === status),
    )
  }, [busca, area, categoria, status, termos])

  return (
    <Layout title="Termos" subtitle="Gerencie termos médicos e odontológicos">
      {/* Filtros */}
      <div className="card">
        <div className="grid md:grid-cols-4 gap-3">
          <input className="input" placeholder="Nome científico ou popular..." value={busca} onChange={e => setBusca(e.target.value)} />
          <select className="select" value={area} onChange={e => setArea(e.target.value as any)}>
            <option>Todas</option><option>Medicina</option><option>Odontologia</option>
          </select>
          <select className="select" value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option>Todas</option>
            {categorias.map(c => (<option key={c.id}>{c.nome}</option>))}
          </select>
          <select className="select" value={status} onChange={e => setStatus(e.target.value as any)}>
            <option>Todos</option><option>Verificado</option><option>Pendente</option>
          </select>
        </div>
      </div>

      {/* Novo */}
      <div className="flex justify-end">
        <button onClick={() => setShowNew(true)} className="btn"><Plus size={16}/> Novo Termo</button>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="card w-[560px] max-w-[95vw]">
            <div className="text-lg font-semibold mb-2">Adicionar novo termo</div>
            <div className="grid gap-3">
              <input className="input" placeholder="Termo científico" value={novo.cientifico} onChange={e => setNovo({ ...novo, cientifico: e.target.value })}/>
              <input className="input" placeholder="Nomes populares (separados por vírgula)" value={novo.populares} onChange={e => setNovo({ ...novo, populares: e.target.value })}/>
              <div className="grid grid-cols-2 gap-3">
                <select className="select" value={novo.area} onChange={e => setNovo({ ...novo, area: e.target.value as Area })}>
                  <option>Medicina</option><option>Odontologia</option>
                </select>
                <select className="select" value={novo.categoria} onChange={e => setNovo({ ...novo, categoria: e.target.value })}>
                  <option value="" disabled>Selecione a categoria</option>
                  {categorias.map(c => (<option key={c.id} value={c.nome}>{c.nome}</option>))}
                </select>
              </div>
              <select className="select" value={novo.status} onChange={e => setNovo({ ...novo, status: e.target.value as Status })}>
                <option value="Pendente">Pendente</option><option value="Verificado">Verificado</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowNew(false)} className="border rounded-xl px-4 py-2">Cancelar</button>
                <button onClick={salvarNovo} className="btn">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="card overflow-x-auto">
        <div className="text-lg font-semibold mb-2">Termos Cadastrados</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2">Termo Científico</th>
              <th>Nomes Populares</th>
              <th>Área</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Atualizado</th>
              <th className="text-right pr-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(t => (
              <tr key={t.id} className="border-t">
                <td className="py-3">{t.cientifico}</td>
                <td className="space-x-1">{t.populares?.map((p: string, i: number) => (<span key={i} className="badge bg-slate-100 text-slate-700">{p}</span>))}</td>
                <td><span className={'badge ' + (t.area === 'Medicina' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700')}>{t.area}</span></td>
                <td>{t.categoria}</td>
                <td>{t.status === 'Verificado'
                    ? (<span className="inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 size={16}/> Verificado</span>)
                    : (<span className="inline-flex items-center gap-1 text-slate-600"><Hourglass size={16}/> Pendente</span>)}
                </td>
                <td>{t.atualizadoEm?.split('-').reverse().join('/')}</td>
                <td className="text-right">
                  <button className="p-2 rounded hover:bg-slate-100" title="Editar" onClick={() => abrirEdicao(t)}><Edit2 size={16}/></button>
                  <button className="p-2 rounded hover:bg-slate-100" title="Excluir" onClick={() => setDelId(t.id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {!filtrados.length && (
              <tr><td colSpan={7} className="py-8 text-center text-slate-500">Nenhum termo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Editar */}
      {edit && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="card w-[560px] max-w-[95vw]">
            <div className="text-lg font-semibold mb-2">Editar termo</div>
            <div className="grid gap-3">
              <input className="input" placeholder="Termo científico" value={edit.cientifico} onChange={e => setEdit({ ...edit, cientifico: e.target.value })}/>
              <input className="input" placeholder="Nomes populares (separados por vírgula)" value={edit.populares} onChange={e => setEdit({ ...edit, populares: e.target.value })}/>
              <div className="grid grid-cols-2 gap-3">
                <select className="select" value={edit.area} onChange={e => setEdit({ ...edit, area: e.target.value as Area })}>
                  <option>Medicina</option><option>Odontologia</option>
                </select>
                <select className="select" value={edit.categoria} onChange={e => setEdit({ ...edit, categoria: e.target.value })}>
                  {categorias.map(c => (<option key={c.id} value={c.nome}>{c.nome}</option>))}
                </select>
              </div>
              <select className="select" value={edit.status} onChange={e => setEdit({ ...edit, status: e.target.value as Status })}>
                <option value="Pendente">Pendente</option><option value="Verificado">Verificado</option>
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
      {delId && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <div className="card w-[520px] max-w-[95vw]">
            <div className="text-lg font-semibold mb-2">Excluir termo</div>
            <p className="text-slate-600 mb-4">Tem certeza que deseja excluir este termo? Esta ação não pode ser desfeita.</p>
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
