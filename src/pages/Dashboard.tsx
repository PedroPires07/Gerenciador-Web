import React from 'react'
import { Layout } from '../components/Layout'
import { termosApi, categoriasApi } from '../data/repo'
import { TrendingUp, CheckCircle, SquarePen, Tag, MessageSquare } from 'lucide-react'

export default function Dashboard() {
  const [termos, setTermos] = React.useState<any[]>([])
  const [categorias, setCategorias] = React.useState<any[]>([])
  React.useEffect(()=>{ (async()=>{ setTermos(await termosApi.list()); setCategorias(await categoriasApi.list()) })() }, [])

  const verificados = termos.filter(t => t.status === 'Verificado').length
  const novos = termos.length

  return (
    <Layout title="Dashboard" subtitle="Visão geral do sistema Dicionário da Saúde">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card"><div className="flex items-center justify-between text-slate-600 text-sm"><span>Total de Termos</span><SquarePen size={16}/></div><div className="text-3xl font-semibold mt-2">{termos.length}</div><div className="text-slate-500 text-sm">Termos cadastrados</div></div>
        <div className="card"><div className="flex items-center justify-between text-slate-600 text-sm"><span>Taxa de Verificação</span><CheckCircle size={16}/></div><div className="text-3xl font-semibold mt-2">{termos.length? Math.round((verificados/termos.length)*100):0}%</div><div className="text-slate-500 text-sm">Termos verificados</div></div>
        <div className="card"><div className="flex items-center justify-between text-slate-600 text-sm"><span>Novos Termos</span><TrendingUp size={16}/></div><div className="text-3xl font-semibold mt-2">{novos}</div><div className="text-slate-500 text-sm">Últimos 30 dias</div></div>
        <div className="card"><div className="flex items-center justify-between text-slate-600 text-sm"><span>Edições</span><SquarePen size={16}/></div><div className="text-3xl font-semibold mt-2">—</div><div className="text-slate-500 text-sm">Últimos 30 dias</div></div>
        <div className="card"><div className="flex items-center justify-between text-slate-600 text-sm"><span>Categorias Ativas</span><Tag size={16}/></div><div className="text-3xl font-semibold mt-2">{categorias.length}</div><div className="text-slate-500 text-sm">Categorias em uso</div></div>
        <div className="card"><div className="flex items-center justify-between text-slate-600 text-sm"><span>Sugestões Pendentes</span><MessageSquare size={16}/></div><div className="text-3xl font-semibold mt-2">—</div><div className="text-slate-500 text-sm">Aguardando revisão</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="font-semibold mb-2">Distribuição por Área</div>
          <div className="space-y-3">
            <div className="flex justify-between text-slate-700"><span>Medicina</span><span>—</span></div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[55%] bg-brand-600"></div></div>
            <div className="flex justify-between text-slate-700"><span>Odontologia</span><span>—</span></div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[45%] bg-brand-600"></div></div>
          </div>
        </div>
        <div className="card">
          <div className="font-semibold mb-2">Top Categorias</div>
          <div className="space-y-3">
            {categorias.slice(0,6).map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-40 text-slate-700">{c.nome}</div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600" style={{width: `${(c.totalTermos||1)*15}%`}}></div>
                </div>
                <div className="w-6 text-right text-slate-700">{c.totalTermos||0}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
