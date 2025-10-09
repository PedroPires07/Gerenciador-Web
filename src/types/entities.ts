export type Area = 'Medicina' | 'Odontologia'
export type Status = 'Verificado' | 'Pendente'

export interface Categoria {
  id: string
  nome: string
  area: Area
  totalTermos: number
  criadoEm: string
}

export interface Termo {
  id: string
  cientifico: string
  populares: string[]
  area: Area
  categoria: string
  status: Status
  atualizadoEm: string
}
