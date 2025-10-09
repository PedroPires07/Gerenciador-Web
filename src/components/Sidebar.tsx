import { LayoutGrid, Tags, BookText, Users, Settings, ReceiptText, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import React from 'react'
import { Logo } from './Logo'
import { useAuth } from '../hooks/useAuth'

const Item: React.FC<{to:string, icon: React.ReactNode, label:string}> = ({to, icon, label}) => (
  <NavLink to={to} className={({isActive}) => 
    'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 ' + (isActive ? 'bg-slate-100 text-brand-700' : 'text-slate-700')
  }>
    {icon}<span>{label}</span>
  </NavLink>
)

export const Sidebar: React.FC = () => {
  const { signOut } = useAuth()
  return (
    <aside className="w-64 border-r min-h-screen sticky top-0">
      <div className="p-4"><Logo /></div>
      <nav className="px-3 space-y-1">
        <Item to="/" icon={<LayoutGrid size={18}/>} label="Dashboard"/>
        <Item to="/termos" icon={<BookText size={18}/>} label="Termos"/>
        <Item to="/categorias" icon={<Tags size={18}/>} label="Categorias"/>
        <Item to="/config" icon={<Settings size={18}/>} label="Configurações"/>
      </nav>
      <div className="px-3 pt-6">
        <button onClick={()=>signOut()} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
          <LogOut size={18}/> Sair
        </button>
      </div>
    </aside>
  )
}
