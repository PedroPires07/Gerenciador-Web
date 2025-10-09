import { Stethoscope } from 'lucide-react'
import React from 'react'
export const Logo: React.FC<{title?: string, className?: string}> = ({title='Dicionário da Saúde', className}) => (
  <div className={'flex items-center gap-2 ' + (className ?? '')}>
    <div className="bg-brand-600 text-white w-10 h-10 rounded-xl grid place-content-center"><Stethoscope size={20} /></div>
    <div className="font-semibold">{title}</div>
  </div>
)
