
import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import {LayoutDashboard, FileText, Video, Briefcase, Settings, Users, BarChart3, LogOut} from 'lucide-react'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminArtigos from '../components/admin/AdminArtigos'
import AdminVideos from '../components/admin/AdminVideos'
import AdminEspecialidades from '../components/admin/AdminEspecialidades'
import AdminConfiguracoes from '../components/admin/AdminConfiguracoes'

const Admin: React.FC = () => {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/artigos', icon: FileText, label: 'Artigos' },
    { path: '/admin/videos', icon: Video, label: 'Vídeos' },
    { path: '/admin/especialidades', icon: Briefcase, label: 'Especialidades' },
    { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
  ]

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
                <p className="text-sm text-gray-500">Gerenciar conteúdo</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Voltar ao Site</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Dra. Ana Silva</p>
                <p className="text-xs text-gray-500">Administradora</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/artigos/*" element={<AdminArtigos />} />
            <Route path="/videos/*" element={<AdminVideos />} />
            <Route path="/especialidades/*" element={<AdminEspecialidades />} />
            <Route path="/configuracoes" element={<AdminConfiguracoes />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Admin
