import { Bell, UserRound } from 'lucide-react'
import React from 'react'

export const Topbar: React.FC = () => (
  <div className="h-14 border-b flex items-center justify-end px-4 gap-3">
    <button className="p-2 rounded-lg hover:bg-slate-100"><Bell size={18}/></button>
    <button className="p-2 rounded-lg hover:bg-slate-100"><UserRound size={18}/></button>
  </div>
)
