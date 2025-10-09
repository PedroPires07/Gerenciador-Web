export type Role = 'admin' | 'moderador' | 'viewer';
export interface User { id: string; nome: string; email: string; role: Role; ativo: boolean; ultimoAcesso: string }
export interface Categoria { id: string; nome: string; area: 'Medicina' | 'Odontologia'; totalTermos: number; criadoEm: string }
export interface Termo { id: string; cientifico: string; populares: string[]; area: 'Medicina' | 'Odontologia'; categoria: string; status: 'Verificado' | 'Pendente'; atualizadoEm: string }
export interface Log { id: string; dataHora: string; acao: string; recurso: string; alvo: string; autor: string; ip: string }
