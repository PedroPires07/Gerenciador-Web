// src/data/repo.ts
import type { User } from './models'
import { auth, db } from '../integrations/firebase/client'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
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
 * TIPOS
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
  atualizadoEm: string
}

/* =========================
 * AUTH
 * ========================= */
export const authApi = {
  /**
   * Login do painel: aceita ADMIN/MODERADOR por
   * - custom claims (admin/moderador) OU
   * - role no Firestore (profiles/{uid}.role in ['admin','moderador']).
   * Atualiza/garante o profile e o ultimoAcesso.
   */
  async signIn(email: string, password: string) {
    const res = await signInWithEmailAndPassword(auth, email, password)
    const uid = res.user.uid
    const now = new Date().toISOString()

    // Garante doc do profile e atualiza ultimoAcesso
    const pref = doc(db, 'profiles', uid)
    const psnap = await getDoc(pref)
    if (!psnap.exists()) {
      await setDoc(
        pref,
        {
          id: uid,
          nome: res.user.displayName ?? '',
          email: res.user.email ?? email,
          role: 'viewer',
          origem: 'web',
          ativo: true,
          ultimoAcesso: now,
        },
        { merge: true }
      )
    } else {
      await updateDoc(pref, {
        ultimoAcesso: now,
        email: res.user.email ?? email,
      })
    }

    // Lê profile e claims
    const profile = (await getDoc(pref)).data() as any
    const token = await res.user.getIdTokenResult(true) // força refresh
    const hasStaffClaim = !!token.claims?.admin || !!token.claims?.moderador
    const isStaffByRole = ['admin', 'moderador'].includes(profile?.role)

    if (!(hasStaffClaim || isStaffByRole)) {
      await fbSignOut(auth)
      throw new Error('Acesso restrito: este login é apenas para administradores/moderadores.')
    }

    return { uid, profile }
  },

  /**
   * Cadastro (use com parcimônia no painel).
   * Aqui deixei como 'admin' porque já estava assim no seu arquivo.
   * Se quiser padrão 'viewer', troque para 'viewer'.
   */
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
        role: 'admin',          // <<< ajuste se quiser 'viewer'
        origem: 'web',          // <<< corrigido (antes estava 'oriem')
        ativo: true,
        ultimoAcesso: new Date().toISOString(),
      },
      { merge: true }
    )
  },

  async signOut() {
    await fbSignOut(auth)
  },

  /**
   * Emite o user apenas se for staff (claims OU role do Firestore).
   */
  onAuthStateChange(cb: (u: any) => void) {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) return cb(null)

      try {
        const [token, psnap] = await Promise.all([
          u.getIdTokenResult(),
          getDoc(doc(db, 'profiles', u.uid)),
        ])

        const hasStaffClaim = !!token.claims?.admin || !!token.claims?.moderador
        const role = psnap.exists() ? (psnap.data() as any)?.role : undefined
        const isStaffByRole = ['admin', 'moderador'].includes(role)

        cb(hasStaffClaim || isStaffByRole ? u : null)
      } catch {
        cb(null)
      }
    })
  },

  me() {
    return auth.currentUser
  },

  async reauth(password: string) {
    const user = auth.currentUser
    if (!user || !user.email) throw new Error('Usuário não autenticado')
    const cred = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, cred)
  },

  async updateName(nome: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Usuário não autenticado')
    await updateProfile(user, { displayName: nome })
    await setDoc(doc(db, 'profiles', user.uid), { nome }, { merge: true })
  },

  async updateEmail(newEmail: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Usuário não autenticado')
    await fbUpdateEmail(user, newEmail)
    await setDoc(doc(db, 'profiles', user.uid), { email: newEmail }, { merge: true })
  },

  async updatePassword(newPass: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Usuário não autenticado')
    await fbUpdatePassword(user, newPass)
  },
}

/* =========================
 * PROFILES
 * ========================= */
export const profilesApi = {
  async list(): Promise<User[]> {
    const snap = await getDocs(collection(db, 'profiles'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as User[]
  },
}

/* =========================
 * CATEGORIAS
 * ========================= */
export const categoriasApi = {
  async list(): Promise<Categoria[]> {
    const q = query(collection(db, 'categorias'), orderBy('nome'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Categoria))
  },

  async create(c: Omit<Categoria, 'id' | 'totalTermos' | 'criadoEm'>): Promise<Categoria> {
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

/* =========================
 * TERMOS
 * ========================= */
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
