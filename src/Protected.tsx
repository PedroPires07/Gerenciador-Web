import React from 'react'
import { useAuth } from './hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

export default function Protected({children}:{children:React.ReactNode}){
  const { loading, user } = useAuth()
  const loc = useLocation()
  if(loading) return null
  if(!user) return <Navigate to="/login" state={{from:loc.pathname}} replace/>
  return <>{children}</>
}
