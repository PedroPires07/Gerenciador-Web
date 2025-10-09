import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../data/repo'

type AuthCtx = {
  loading:boolean
  user:any
  signIn:(email:string,password:string)=>Promise<void>
  signUp:(nome:string,email:string,password:string)=>Promise<void>
  signOut:()=>Promise<void>
}
const Ctx = createContext<AuthCtx|null>(null)

export function AuthProvider({children}:{children:any}){
  const [loading,setLoading] = useState(true)
  const [user,setUser] = useState<any>(null)
  useEffect(()=>{
    const unsub = authApi.onAuthStateChange(u=>{ setUser(u); setLoading(false) })
    return ()=>{ (unsub as any)?.() }
  },[])
  return <Ctx.Provider value={{
    loading,user,
    signIn: authApi.signIn,
    signUp: authApi.signUp,
    signOut: authApi.signOut
  }}>{children}</Ctx.Provider>
}

export function useAuth(){
  const v = useContext(Ctx)
  if(!v) throw new Error('useAuth must be used inside AuthProvider')
  return v
}
