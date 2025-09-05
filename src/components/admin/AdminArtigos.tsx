
import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import {Plus, Search, Filter, Edit2, Trash2, Eye, Calendar, ArrowLeft, Save, X} from 'lucide-react'
import toast from 'react-hot-toast'
import { lumi } from '../../lib/lumi'

interface Artigo {
  _id: string
  titulo: string
  resumo: string
  conteudo: string
  categoria: string
  tags: string[]
  imagemCapa: string
  status: string
  dataPublicacao: string
  visualizacoes: number
  autor: string
}

const AdminArtigos: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ArtigosLista />} />
      <Route path="/novo" element={<ArtigoForm />} />
      <Route path="/editar/:id" element={<ArtigoForm />} />
    </Routes>
  )
}

const ArtigosLista: React.FC = () => {
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [filteredArtigos, setFilteredArtigos] = useState<Artigo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('')

  const categorias = [
    'ansiedade', 'depressao', 'relacionamentos', 'autoestima', 
    'stress', 'terapia', 'psicologia-infantil', 'outros'
  ]

  useEffect(() => {
    fetchArtigos()
  }, [])

  useEffect(() => {
    let filtered = artigos

    if (searchTerm) {
      filtered = filtered.filter(artigo =>
        artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artigo.resumo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(artigo => artigo.status === statusFilter)
    }

    if (categoriaFilter) {
      filtered = filtered.filter(artigo => artigo.categoria === categoriaFilter)
    }

    setFilteredArtigos(filtered)
  }, [artigos, searchTerm, statusFilter, categoriaFilter])

  const fetchArtigos = async () => {
    try {
      const { list } = await lumi.entities.artigos.list({
        sort: { createdAt: -1 }
      })
      // setArtigos(list || [])
    } catch (error) {
      console.error('Erro ao carregar artigos:', error)
      toast.error('Erro ao carregar artigos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir o artigo "${titulo}"?`)) {
      return
    }

    try {
      await lumi.entities.artigos.delete(id)
      setArtigos(prev => prev.filter(a => a._id !== id))
      toast.success('Artigo excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir artigo:', error)
      toast.error('Erro ao excluir artigo')
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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Artigos</h1>
          <p className="text-gray-600">Crie e gerencie seus artigos sobre saúde mental</p>
        </div>
        <Link
          to="/admin/artigos/novo"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Artigo
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar artigos..."
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
            {filteredArtigos.length} artigo(s) encontrado(s)
          </div>
        </div>
      </div>

      {/* Lista de Artigos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredArtigos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum artigo encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artigo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visualizações
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArtigos.map((artigo) => (
                  <tr key={artigo._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={artigo.imagemCapa}
                          alt={artigo.titulo}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {artigo.titulo}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {artigo.resumo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getCategoriaLabel(artigo.categoria)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(artigo.status)}`}>
                        {artigo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* {new Date(artigo.dataPublicacao || artigo.createdAt).toLocaleDateString('pt-BR')} */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {artigo.visualizacoes || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/artigos/editar/${artigo._id}`}
                          className="text-teal-600 hover:text-teal-900 p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(artigo._id, artigo.titulo)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const ArtigoForm: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [artigoId, setArtigoId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    categoria: '',
    tags: '',
    imagemCapa: '',
    status: 'rascunho',
    dataPublicacao: '',
    autor: 'Dra. Ana Silva'
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
    const editMatch = path.match(/\/admin\/artigos\/editar\/(.+)/)
    
    if (editMatch) {
      setIsEdit(true)
      setArtigoId(editMatch[1])
      loadArtigo(editMatch[1])
    } else {
      setFormData(prev => ({
        ...prev,
        dataPublicacao: new Date().toISOString().split('T')[0]
      }))
    }
  }, [])

  const loadArtigo = async (id: string) => {
    try {
      // setLoading(true)
      // const artigo = await lumi.entities.artigos.get(id)
      // setFormData({
      //   titulo: artigo.titulo,
      //   resumo: artigo.resumo,
      //   conteudo: artigo.conteudo,
      //   categoria: artigo.categoria,
      //   tags: artigo.tags ? artigo.tags.join(', ') : '',
      //   imagemCapa: artigo.imagemCapa,
      //   status: artigo.status,
      //   dataPublicacao: artigo.dataPublicacao ? artigo.dataPublicacao.split('T')[0] : '',
      //   autor: artigo.autor || 'Dra. Ana Silva'
      // })
    } catch (error) {
      console.error('Erro ao carregar artigo:', error)
      toast.error('Erro ao carregar artigo')
      navigate('/admin/artigos')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const artigoData = {
        titulo: formData.titulo,
        resumo: formData.resumo,
        conteudo: formData.conteudo,
        categoria: formData.categoria,
        tags,
        imagemCapa: formData.imagemCapa,
        status: formData.status,
        dataPublicacao: new Date(formData.dataPublicacao).toISOString(),
        autor: formData.autor,
        visualizacoes: 0,
        ...(isEdit ? { updatedAt: new Date().toISOString() } : { createdAt: new Date().toISOString() })
      }

      if (isEdit && artigoId) {
        await lumi.entities.artigos.update(artigoId, artigoData)
        toast.success('Artigo atualizado com sucesso')
      } else {
        await lumi.entities.artigos.create(artigoData)
        toast.success('Artigo criado com sucesso')
      }

      navigate('/admin/artigos')
    } catch (error) {
      console.error('Erro ao salvar artigo:', error)
      toast.error('Erro ao salvar artigo')
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
            to="/admin/artigos"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Editar Artigo' : 'Novo Artigo'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Edite as informações do artigo' : 'Crie um novo artigo sobre saúde mental'}
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
                placeholder="Digite o título do artigo"
              />
            </div>

            {/* Resumo */}
            <div className="lg:col-span-2">
              <label htmlFor="resumo" className="block text-sm font-medium text-gray-700 mb-2">
                Resumo *
              </label>
              <textarea
                id="resumo"
                name="resumo"
                required
                rows={3}
                value={formData.resumo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Resumo breve do artigo"
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

            {/* Tags */}
            <div>
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

            {/* Imagem de Capa */}
            <div className="lg:col-span-2">
              <label htmlFor="imagemCapa" className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem de Capa *
              </label>
              <input
                type="url"
                id="imagemCapa"
                name="imagemCapa"
                required
                value={formData.imagemCapa}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            {/* Conteúdo */}
            <div className="lg:col-span-2">
              <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo *
              </label>
              <textarea
                id="conteudo"
                name="conteudo"
                required
                rows={15}
                value={formData.conteudo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Conteúdo completo do artigo..."
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            to="/admin/artigos"
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
                {isEdit ? 'Atualizar' : 'Criar'} Artigo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminArtigos
