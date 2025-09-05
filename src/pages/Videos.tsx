
import React, { useState, useEffect } from 'react'
import {Play, Clock, Eye, Search, Filter} from 'lucide-react'
import { lumi } from '../lib/lumi'

interface Video {
  _id: string
  titulo: string
  descricao: string
  url: string
  thumbnail: string
  categoria: string
  duracao: string
  tags: string[]
  visualizacoes: number
  destaque: boolean
}

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const categorias = [
    { value: '',                    label: 'Todas as categorias' },
    { value: 'ansiedade',           label: 'Ansiedade' },
    { value: 'depressao',           label: 'Depressão' },
    { value: 'relacionamentos',     label: 'Relacionamentos' },
    { value: 'autoestima',          label: 'Autoestima' },
    { value: 'stress',              label: 'Estresse' },
    { value: 'terapia',             label: 'Terapia' },
    { value: 'psicologia-infantil', label: 'Psicologia Infantil' },
    { value: 'outros',              label: 'Outros' }
  ]

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { list } = await lumi.entities.videos.list({
          filter: { status: 'publicado' },
          sort: { destaque: -1, dataPublicacao: -1 }
        })
        setVideos(list || [])
        setFilteredVideos(list || [])
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  useEffect(() => {
    let filtered = videos

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(video => video.categoria === selectedCategory)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredVideos(filtered)
  }, [videos, searchTerm, selectedCategory])

  const getCategoryLabel = (category: string) => {
    const cat = categorias.find(c => c.value === category)
    return cat ? cat.label : category
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'ansiedade': 'bg-blue-100 text-blue-800',
      'depressao': 'bg-purple-100 text-purple-800',
      'relacionamentos': 'bg-pink-100 text-pink-800',
      'autoestima': 'bg-green-100 text-green-800',
      'stress': 'bg-orange-100 text-orange-800',
      'terapia': 'bg-teal-100 text-teal-800',
      'psicologia-infantil': 'bg-yellow-100 text-yellow-800',
      'outros': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const handleVideoClick = async (video: Video) => {
    setSelectedVideo(video)
    
    // Incrementar visualizações
    try {
      await lumi.entities.videos.update(video._id, {
        visualizacoes: (video.visualizacoes || 0) + 1
      })
      
      // Atualizar o estado local
      setVideos(prev => prev.map(v => 
        v._id === video._id ? { ...v, visualizacoes: (v.visualizacoes || 0) + 1 } : v
      ))
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error)
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Vídeos Educativos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conteúdo em vídeo para apoiar seu desenvolvimento pessoal e bem-estar emocional.
          </p>
        </div>

        {/* Player de Vídeo */}
        {selectedVideo && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo.url)}
                  title={selectedVideo.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium mr-4 ${getCategoryColor(selectedVideo.categoria)}`}>
                    {getCategoryLabel(selectedVideo.categoria)}
                  </span>
                  {selectedVideo.destaque && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      Destaque
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {selectedVideo.titulo}
                </h2>
                <p className="text-gray-700 mb-4">
                  {selectedVideo.descricao}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedVideo.duracao}
                  <Eye className="w-4 h-4 ml-4 mr-1" />
                  {selectedVideo.visualizacoes} visualizações
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar vídeos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Categoria */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                >
                  {categorias.map(categoria => (
                    <option key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Vídeos */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm || selectedCategory
                ? 'Nenhum vídeo encontrado com os filtros selecionados.'
                : 'Nenhum vídeo publicado ainda.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-gray-600">
                {filteredVideos.length} {filteredVideos.length === 1 ? 'vídeo encontrado' : 'vídeos encontrados'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video, index) => (
                <div
                  key={video._id}
                  onClick={() => handleVideoClick(video)}
                  className={`card group cursor-pointer fade-in ${
                    selectedVideo?._id === video._id ? 'ring-2 ring-teal-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.titulo}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(video.categoria)}`}>
                        {getCategoryLabel(video.categoria)}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {video.duracao}
                    </div>
                    {video.destaque && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                          DESTAQUE
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {video.titulo}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {video.descricao}
                    </p>

                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-1" />
                      {video.visualizacoes} visualizações
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Videos
