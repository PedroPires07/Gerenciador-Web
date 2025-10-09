import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Termos from './pages/Termos'
import Categorias from './pages/Categorias'
import Config from './pages/Config'
import AuthLogin from './pages/AuthLogin'
import AuthRegister from './pages/AuthRegister'
import Protected from './Protected'
import { AuthProvider } from './hooks/useAuth'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/register" element={<AuthRegister />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/termos" element={<Protected><Termos /></Protected>} />
        <Route path="/categorias" element={<Protected><Categorias /></Protected>} />
        <Route path="/config" element={<Protected><Config /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </AuthProvider>
  )
}
