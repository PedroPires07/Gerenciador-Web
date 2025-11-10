
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Stethoscope, LayoutGrid, BookText, Tags, Settings, LogOut } from 'lucide-react'
import { authApi } from '../data/repo'

type Props = {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function Layout({ title, subtitle, children }: Props) {
  const navigate = useNavigate()

  async function handleSignOut() {
    await authApi.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen hidden md:block">
          <div className="flex items-center gap-2 px-5 h-16 border-b">
            <div className="h-9 w-9 grid place-items-center rounded-xl bg-brand-600 text-white">
              <Stethoscope size={18} />
            </div>
            <div className="font-semibold">Dicionário da Saúde</div>
          </div>

          <nav className="p-3 space-y-1">
            <Item to="/" icon={<LayoutGrid size={16} />} label="Dashboard" />
            <Item to="/termos" icon={<BookText size={16} />} label="Termos" />
            <Item to="/categorias" icon={<Tags size={16} />} label="Categorias" />
            <Item to="/config" icon={<Settings size={16} />} label="Configurações" />
          </nav>

          <div className="px-3 mt-4">
            <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100">
              <LogOut size={16} /> <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Top bar (sem ícones à direita) */}
          <div className="h-16 bg-white border-b grid items-center px-4 md:px-8">
            <div>
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {subtitle && <p className="text-slate-500 text-sm -mt-1">{subtitle}</p>}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

function Item({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg ${
          isActive ? 'bg-purple-50 text-purple-700' : 'hover:bg-slate-100'
        }`
      }
      end
    >
      {icon} <span>{label}</span>
    </NavLink>
  )
}
