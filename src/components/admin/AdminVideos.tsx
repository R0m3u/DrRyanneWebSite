
import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import {Plus, Search, Edit2, Trash2, Eye, Play, ArrowLeft, Save, Star} from 'lucide-react'
import toast from 'react-hot-toast'
// import { lumi } from '../../lib/lumi'

interface Video {
  _id: string
  titulo: string
  descricao: string
  url: string
  thumbnail: string
  categoria: string
  duracao: string
  tags: string[]
  status: string
  dataPublicacao: string
  visualizacoes: number
  destaque: boolean
}

const AdminVideos: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<VideosLista />} />
      <Route path="/novo" element={<VideoForm />} />
      <Route path="/editar/:id" element={<VideoForm />} />
    </Routes>
  )
}

const VideosLista: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('')

  const categorias = [
    'ansiedade', 'depressao', 'relacionamentos', 'autoestima', 
    'stress', 'terapia', 'psicologia-infantil', 'outros'
  ]

  useEffect(() => {
    fetchVideos()
  }, [])

  useEffect(() => {
    let filtered = videos

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(video => video.status === statusFilter)
    }

    if (categoriaFilter) {
      filtered = filtered.filter(video => video.categoria === categoriaFilter)
    }

    setFilteredVideos(filtered)
  }, [videos, searchTerm, statusFilter, categoriaFilter])

  const fetchVideos = async () => {
    try {
      const { list } = await lumi.entities.videos.list({
        sort: { createdAt: -1 }
      })
      setVideos(list || [])
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error)
      toast.error('Erro ao carregar vídeos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir o vídeo "${titulo}"?`)) {
      return
    }

    try {
      await lumi.entities.videos.delete(id)
      setVideos(prev => prev.filter(v => v._id !== id))
      toast.success('Vídeo excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error)
      toast.error('Erro ao excluir vídeo')
    }
  }

  const toggleDestaque = async (id: string, currentDestaque: boolean) => {
    try {
      await lumi.entities.videos.update(id, {
        destaque: !currentDestaque
      })
      setVideos(prev => prev.map(v => 
        v._id === id ? { ...v, destaque: !currentDestaque } : v
      ))
      toast.success(`Vídeo ${!currentDestaque ? 'adicionado aos' : 'removido dos'} destaques`)
    } catch (error) {
      console.error('Erro ao atualizar destaque:', error)
      toast.error('Erro ao atualizar destaque')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publicado': return 'bg-green-100 text-green-800'
      case 'rascunho': return 'bg-yellow-100 text-yellow-800'
      case 'arquivado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'ansiedade': 'Ansiedade',
      'depressao': 'Depressão',
      'relacionamentos': 'Relacionamentos',
      'autoestima': 'Autoestima',
      'stress': 'Estresse',
      'terapia': 'Terapia',
      'psicologia-infantil': 'Psicologia Infantil',
      'outros': 'Outros'
    }
    return labels[categoria] || categoria
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Vídeos</h1>
          <p className="text-gray-600">Crie e gerencie seus vídeos educativos</p>
        </div>
        <Link
          to="/admin/videos/novo"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Vídeo
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="publicado">Publicado</option>
            <option value="rascunho">Rascunho</option>
            <option value="arquivado">Arquivado</option>
          </select>

          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {getCategoriaLabel(categoria)}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            {filteredVideos.length} vídeo(s) encontrado(s)
          </div>
        </div>
      </div>

      {/* Lista de Vídeos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum vídeo encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredVideos.map((video) => (
              <div key={video._id} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.titulo}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {video.duracao}
                  </div>
                  {video.destaque && (
                    <div className="absolute top-2 left-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(video.status)}`}>
                      {video.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getCategoriaLabel(video.categoria)}
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {video.titulo}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.descricao}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {video.visualizacoes || 0}
                    </div>
                    <span>
                      {new Date(video.dataPublicacao || video.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleDestaque(video._id, video.destaque)}
                      className={`p-1 rounded transition-colors ${
                        video.destaque 
                          ? 'text-yellow-600 hover:text-yellow-700' 
                          : 'text-gray-400 hover:text-yellow-600'
                      }`}
                      title={video.destaque ? 'Remover dos destaques' : 'Adicionar aos destaques'}
                    >
                      <Star className={`w-4 h-4 ${video.destaque ? 'fill-current' : ''}`} />
                    </button>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/videos/editar/${video._id}`}
                        className="text-teal-600 hover:text-teal-900 p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(video._id, video.titulo)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const VideoForm: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    url: '',
    thumbnail: '',
    categoria: '',
    duracao: '',
    tags: '',
    status: 'rascunho',
    dataPublicacao: '',
    destaque: false
  })

  const categorias = [
    { value: 'ansiedade', label: 'Ansiedade' },
    { value: 'depressao', label: 'Depressão' },
    { value: 'relacionamentos', label: 'Relacionamentos' },
    { value: 'autoestima', label: 'Autoestima' },
    { value: 'stress', label: 'Estresse' },
    { value: 'terapia', label: 'Terapia' },
    { value: 'psicologia-infantil', label: 'Psicologia Infantil' },
    { value: 'outros', label: 'Outros' }
  ]

  useEffect(() => {
    const path = window.location.pathname
    const editMatch = path.match(/\/admin\/videos\/editar\/(.+)/)
    
    if (editMatch) {
      setIsEdit(true)
      setVideoId(editMatch[1])
      loadVideo(editMatch[1])
    } else {
      setFormData(prev => ({
        ...prev,
        dataPublicacao: new Date().toISOString().split('T')[0]
      }))
    }
  }, [])

  const loadVideo = async (id: string) => {
    try {
      setLoading(true)
      const video = await lumi.entities.videos.get(id)
      setFormData({
        titulo: video.titulo,
        descricao: video.descricao,
        url: video.url,
        thumbnail: video.thumbnail,
        categoria: video.categoria,
        duracao: video.duracao,
        tags: video.tags ? video.tags.join(', ') : '',
        status: video.status,
        dataPublicacao: video.dataPublicacao ? video.dataPublicacao.split('T')[0] : '',
        destaque: video.destaque || false
      })
    } catch (error) {
      console.error('Erro ao carregar vídeo:', error)
      toast.error('Erro ao carregar vídeo')
      navigate('/admin/videos')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const videoData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        url: formData.url,
        thumbnail: formData.thumbnail,
        categoria: formData.categoria,
        duracao: formData.duracao,
        tags,
        status: formData.status,
        dataPublicacao: new Date(formData.dataPublicacao).toISOString(),
        destaque: formData.destaque,
        visualizacoes: 0,
        ordem: 0,
        ...(isEdit ? { updatedAt: new Date().toISOString() } : { createdAt: new Date().toISOString() })
      }

      if (isEdit && videoId) {
        await lumi.entities.videos.update(videoId, videoData)
        toast.success('Vídeo atualizado com sucesso')
      } else {
        await lumi.entities.videos.create(videoData)
        toast.success('Vídeo criado com sucesso')
      }

      navigate('/admin/videos')
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error)
      toast.error('Erro ao salvar vídeo')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/videos"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Editar Vídeo' : 'Novo Vídeo'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Edite as informações do vídeo' : 'Adicione um novo vídeo educativo'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Título */}
            <div className="lg:col-span-2">
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                required
                value={formData.titulo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Digite o título do vídeo"
              />
            </div>

            {/* Descrição */}
            <div className="lg:col-span-2">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                id="descricao"
                name="descricao"
                required
                rows={4}
                value={formData.descricao}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Descrição do vídeo"
              />
            </div>

            {/* URL do Vídeo */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                URL do Vídeo *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                value={formData.url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                URL da Thumbnail *
              </label>
              <input
                type="url"
                id="thumbnail"
                name="thumbnail"
                required
                value={formData.thumbnail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://exemplo.com/thumbnail.jpg"
              />
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                id="categoria"
                name="categoria"
                required
                value={formData.categoria}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(categoria => (
                  <option key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duração */}
            <div>
              <label htmlFor="duracao" className="block text-sm font-medium text-gray-700 mb-2">
                Duração *
              </label>
              <input
                type="text"
                id="duracao"
                name="duracao"
                required
                value={formData.duracao}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="ex: 10:30"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="rascunho">Rascunho</option>
                <option value="publicado">Publicado</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>

            {/* Data de Publicação */}
            <div>
              <label htmlFor="dataPublicacao" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Publicação *
              </label>
              <input
                type="date"
                id="dataPublicacao"
                name="dataPublicacao"
                required
                value={formData.dataPublicacao}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <div className="lg:col-span-2">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Separadas por vírgula"
              />
            </div>

            {/* Destaque */}
            <div className="lg:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="destaque"
                  name="destaque"
                  checked={formData.destaque}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="destaque" className="ml-2 block text-sm text-gray-900">
                  Marcar como vídeo em destaque
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            to="/admin/videos"
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Atualizar' : 'Criar'} Vídeo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminVideos
