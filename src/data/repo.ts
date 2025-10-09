import type { User } from './models'
import { auth, db } from '../integrations/firebase/client'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
  // === novos imports p/ Config ===
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  setDoc,
  getDoc,
} from 'firebase/firestore'

/* =========================
 * TIPOS (fonte da verdade)
 * ========================= */
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
  atualizadoEm: string // ou Timestamp, se preferir
}

/* =============
 * AUTH
 * ============= */
export const authApi = {
  async signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  },

  async signUp(nome: string, email: string, password: string) {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(res.user, { displayName: nome })
    const ref = doc(db, 'profiles', res.user.uid)
    await setDoc(
      ref,
      {
        id: res.user.uid,
        nome,
        email,
        role: 'viewer',
        ativo: true,
        ultimoAcesso: new Date().toISOString(),
      },
      { merge: true },
    )
  },

  async signOut() {
    await fbSignOut(auth)
  },

  onAuthStateChange(cb: (u: any) => void) {
    return onAuthStateChanged(auth, (u) => cb(u))
  },

  // ========= usados pela tela Config =========
  /** Usuário atual (pode ser null) */
  me() {
    return auth.currentUser
  },

  /** Reautentica usando a senha atual (obrigatório antes de trocar email/senha) */
  async reauth(password: string) {
    const user = auth.currentUser
    if (!user || !user.email) throw new Error('Usuário não autenticado')
    const cred = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, cred)
  },

  /** Atualiza o displayName e sincroniza no doc profiles/{uid} */
  async updateName(nome: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Usuário não autenticado')
    await updateProfile(user, { displayName: nome })
    await setDoc(doc(db, 'profiles', user.uid), { nome }, { merge: true })
  },

  /** Atualiza email no Auth e no doc profiles/{uid} (requer reauth prévia) */
  async updateEmail(newEmail: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Usuário não autenticado')
    await fbUpdateEmail(user, newEmail)
    await setDoc(doc(db, 'profiles', user.uid), { email: newEmail }, { merge: true })
  },

  /** Atualiza a senha no Auth (requer reauth prévia) */
  async updatePassword(newPass: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Usuário não autenticado')
    await fbUpdatePassword(user, newPass)
  },
}

/* =============
 * PERFIS
 * ============= */
export const profilesApi = {
  async list(): Promise<User[]> {
    const snap = await getDocs(collection(db, 'profiles'))
    // Retorna o id do doc junto
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as User[]
  },
}

/* =============
 * CATEGORIAS
 * ============= */
export const categoriasApi = {
  async list(): Promise<Categoria[]> {
    const q = query(collection(db, 'categorias'), orderBy('nome'))
    const snap = await getDocs(q)
    return snap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as any) } as Categoria),
    )
  },

  async create(
    c: Omit<Categoria, 'id' | 'totalTermos' | 'criadoEm'>,
  ): Promise<Categoria> {
    const ref = await addDoc(collection(db, 'categorias'), {
      nome: c.nome,
      area: c.area,
      totalTermos: 0,
      criadoEm: new Date().toISOString().slice(0, 10),
    })
    const st = await getDoc(ref)
    return { id: ref.id, ...(st.data() as any) } as Categoria
  },

  async update(id: string, patch: Partial<Categoria>): Promise<void> {
    await updateDoc(doc(db, 'categorias', id), patch as any)
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, 'categorias', id))
  },
}

/* =============
 * TERMOS
 * ============= */
export const termosApi = {
  async list(): Promise<Termo[]> {
    const q = query(collection(db, 'termos'), orderBy('atualizadoEm', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data() as any
      return {
        id: d.id,
        cientifico: data.cientifico ?? '',
        populares: Array.isArray(data.populares) ? data.populares : [],
        area: data.area as Area,
        categoria: data.categoria ?? '',
        status: data.status as Status,
        atualizadoEm: data.atualizadoEm ?? '',
      } as Termo
    })
  },

  async create(t: Omit<Termo, 'id'>): Promise<Termo> {
    const ref = await addDoc(collection(db, 'termos'), t)
    const st = await getDoc(ref)
    return { id: ref.id, ...(st.data() as any) } as Termo
  },

  async update(id: string, patch: Partial<Termo>): Promise<void> {
    await updateDoc(doc(db, 'termos', id), patch as any)
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, 'termos', id))
  },
}
