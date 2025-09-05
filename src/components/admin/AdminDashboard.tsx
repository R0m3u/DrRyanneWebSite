
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {FileText, Video, Briefcase, Eye, TrendingUp, Calendar, Plus, ArrowRight} from 'lucide-react'
import { lumi } from '../../lib/lumi'

interface Stats {
  totalArtigos: number
  totalVideos: number
  totalEspecialidades: number
  totalVisualizacoes: number
}

interface RecentItem {
  _id: string
  titulo: string
  tipo: 'artigo' | 'video'
  dataPublicacao: string
  visualizacoes: number
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalArtigos: 0,
    totalVideos: 0,
    totalEspecialidades: 0,
    totalVisualizacoes: 0
  })
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Buscar estatísticas
        const [artigosResult, videosResult, especialidadesResult] = await Promise.all([
          lumi.entities.artigos.list({ filter: { status: 'publicado' } }),
          lumi.entities.videos.list({ filter: { status: 'publicado' } }),
          lumi.entities.especialidades.list({ filter: { ativo: true } })
        ])

        const artigos = artigosResult.list || []
        const videos = videosResult.list || []
        const especialidades = especialidadesResult.list || []

        const totalVisualizacoes = [
          ...artigos.map(a => a.visualizacoes || 0),
          ...videos.map(v => v.visualizacoes || 0)
        ].reduce((sum, views) => sum + views, 0)

        setStats({
          totalArtigos: artigos.length,
          totalVideos: videos.length,
          totalEspecialidades: especialidades.length,
          totalVisualizacoes
        })

        // Buscar itens recentes
        const recentArtigos = artigos
          .sort((a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime())
          .slice(0, 3)
          .map(a => ({
            _id: a._id,
            titulo: a.titulo,
            tipo: 'artigo' as const,
            dataPublicacao: a.dataPublicacao,
            visualizacoes: a.visualizacoes || 0
          }))

        const recentVideos = videos
          .sort((a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime())
          .slice(0, 2)
          .map(v => ({
            _id: v._id,
            titulo: v.titulo,
            tipo: 'video' as const,
            dataPublicacao: v.dataPublicacao,
            visualizacoes: v.visualizacoes || 0
          }))

        const allRecent = [...recentArtigos, ...recentVideos]
          .sort((a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime())
          .slice(0, 5)

        setRecentItems(allRecent)
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Total de Artigos',
      value: stats.totalArtigos,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/artigos'
    },
    {
      title: 'Total de Vídeos',
      value: stats.totalVideos,
      icon: Video,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/videos'
    },
    {
      title: 'Especialidades',
      value: stats.totalEspecialidades,
      icon: Briefcase,
      color: 'from-teal-500 to-teal-600',
      link: '/admin/especialidades'
    },
    {
      title: 'Total de Visualizações',
      value: stats.totalVisualizacoes,
      icon: Eye,
      color: 'from-green-500 to-green-600',
      link: '#'
    }
  ]

  const quickActions = [
    {
      title: 'Novo Artigo',
      description: 'Criar um novo artigo',
      icon: FileText,
      link: '/admin/artigos/novo',
      color: 'bg-blue-500'
    },
    {
      title: 'Novo Vídeo',
      description: 'Adicionar um novo vídeo',
      icon: Video,
      link: '/admin/videos/novo',
      color: 'bg-purple-500'
    },
    {
      title: 'Nova Especialidade',
      description: 'Cadastrar especialidade',
      icon: Briefcase,
      link: '/admin/especialidades/nova',
      color: 'bg-teal-500'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu conteúdo e estatísticas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ações Rápidas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Conteúdo Recente */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Conteúdo Recente</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>

            {recentItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum conteúdo recente encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.tipo === 'artigo' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {item.tipo === 'artigo' ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <Video className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.titulo}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.visualizacoes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
