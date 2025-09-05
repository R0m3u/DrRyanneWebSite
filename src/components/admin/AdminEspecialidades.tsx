
import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import {Plus, Search, Edit2, Trash2, ArrowLeft, Save, Eye, EyeOff, ArrowUp, ArrowDown} from 'lucide-react'
import toast from 'react-hot-toast'
import { lumi } from '../../lib/lumi'

interface Especialidade {
  _id: string
  nome: string
  descricao: string
  resumo: string
  icone: string
  imagem: string
  ativo: boolean
  ordem: number
  duracao: string
  metodologia: string
}

const AdminEspecialidades: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EspecialidadesLista />} />
      <Route path="/nova" element={<EspecialidadeForm />} />
      <Route path="/editar/:id" element={<EspecialidadeForm />} />
    </Routes>
  )
}

const EspecialidadesLista: React.FC = () => {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [filteredEspecialidades, setFilteredEspecialidades] = useState<Especialidade[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchEspecialidades()
  }, [])

  useEffect(() => {
    let filtered = especialidades

    if (searchTerm) {
      filtered = filtered.filter(esp =>
        esp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        esp.resumo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter === 'ativo') {
      filtered = filtered.filter(esp => esp.ativo)
    } else if (statusFilter === 'inativo') {
      filtered = filtered.filter(esp => !esp.ativo)
    }

    setFilteredEspecialidades(filtered)
  }, [especialidades, searchTerm, statusFilter])

  const fetchEspecialidades = async () => {
    try {
      const { list } = await lumi.entities.especialidades.list({
        sort: { ordem: 1 }
      })
      setEspecialidades(list || [])
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error)
      toast.error('Erro ao carregar especialidades')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a especialidade "${nome}"?`)) {
      return
    }

    try {
      await lumi.entities.especialidades.delete(id)
      setEspecialidades(prev => prev.filter(e => e._id !== id))
      toast.success('Especialidade excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir especialidade:', error)
      toast.error('Erro ao excluir especialidade')
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await lumi.entities.especialidades.update(id, {
        ativo: !currentStatus
      })
      setEspecialidades(prev => prev.map(e => 
        e._id === id ? { ...e, ativo: !currentStatus } : e
      ))
      toast.success(`Especialidade ${!currentStatus ? 'ativada' : 'desativada'} com sucesso`)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const moveEspecialidade = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = especialidades.findIndex(e => e._id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= especialidades.length) return

    const newEspecialidades = [...especialidades]
    const [movedItem] = newEspecialidades.splice(currentIndex, 1)
    newEspecialidades.splice(newIndex, 0, movedItem)

    // Atualizar ordens
    const updates = newEspecialidades.map((esp, index) => ({
      id: esp._id,
      ordem: index + 1
    }))

    try {
      await Promise.all(
        updates.map(update => 
          lumi.entities.especialidades.update(update.id, { ordem: update.ordem })
        )
      )

      setEspecialidades(newEspecialidades.map((esp, index) => ({
        ...esp,
        ordem: index + 1
      })))

      toast.success('Ordem atualizada com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error)
      toast.error('Erro ao atualizar ordem')
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Especialidades</h1>
          <p className="text-gray-600">Gerencie suas áreas de especialização</p>
        </div>
        <Link
          to="/admin/especialidades/nova"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Especialidade
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar especialidades..."
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
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            {filteredEspecialidades.length} especialidade(s) encontrada(s)
          </div>
        </div>
      </div>

      {/* Lista de Especialidades */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredEspecialidades.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma especialidade encontrada</p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {filteredEspecialidades.map((especialidade, index) => (
              <div key={especialidade._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-3xl">{especialidade.icone}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {especialidade.nome}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          especialidade.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {especialidade.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Ordem: {especialidade.ordem}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{especialidade.resumo}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <strong>Duração:</strong> {especialidade.duracao}
                        </div>
                        <div>
                          <strong>Metodologia:</strong> {especialidade.metodologia}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {/* Controles de Ordem */}
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => moveEspecialidade(especialidade._id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveEspecialidade(especialidade._id, 'down')}
                        disabled={index === filteredEspecialidades.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ações */}
                    <button
                      onClick={() => toggleStatus(especialidade._id, especialidade.ativo)}
                      className={`p-2 rounded transition-colors ${
                        especialidade.ativo 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-green-600'
                      }`}
                      title={especialidade.ativo ? 'Desativar' : 'Ativar'}
                    >
                      {especialidade.ativo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <Link
                      to={`/admin/especialidades/editar/${especialidade._id}`}
                      className="text-teal-600 hover:text-teal-900 p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(especialidade._id, especialidade.nome)}
                      className="text-red-600 hover:text-red-900 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

const EspecialidadeForm: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [especialidadeId, setEspecialidadeId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    resumo: '',
    icone: '',
    imagem: '',
    ativo: true,
    duracao: '',
    metodologia: ''
  })

  useEffect(() => {
    const path = window.location.pathname
    const editMatch = path.match(/\/admin\/especialidades\/editar\/(.+)/)
    
    if (editMatch) {
      setIsEdit(true)
      setEspecialidadeId(editMatch[1])
      loadEspecialidade(editMatch[1])
    }
  }, [])

  const loadEspecialidade = async (id: string) => {
    try {
      setLoading(true)
      const especialidade = await lumi.entities.especialidades.get(id)
      setFormData({
        nome: especialidade.nome,
        descricao: especialidade.descricao,
        resumo: especialidade.resumo,
        icone: especialidade.icone,
        imagem: especialidade.imagem,
        ativo: especialidade.ativo,
        duracao: especialidade.duracao,
        metodologia: especialidade.metodologia
      })
    } catch (error) {
      console.error('Erro ao carregar especialidade:', error)
      toast.error('Erro ao carregar especialidade')
      navigate('/admin/especialidades')
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
      const especialidadeData = {
        nome: formData.nome,
        descricao: formData.descricao,
        resumo: formData.resumo,
        icone: formData.icone,
        imagem: formData.imagem,
        ativo: formData.ativo,
        duracao: formData.duracao,
        metodologia: formData.metodologia,
        ...(isEdit ? { updatedAt: new Date().toISOString() } : { 
          createdAt: new Date().toISOString(),
          ordem: await getNextOrdem()
        })
      }

      if (isEdit && especialidadeId) {
        await lumi.entities.especialidades.update(especialidadeId, especialidadeData)
        toast.success('Especialidade atualizada com sucesso')
      } else {
        await lumi.entities.especialidades.create(especialidadeData)
        toast.success('Especialidade criada com sucesso')
      }

      navigate('/admin/especialidades')
    } catch (error) {
      console.error('Erro ao salvar especialidade:', error)
      toast.error('Erro ao salvar especialidade')
    } finally {
      setLoading(false)
    }
  }

  const getNextOrdem = async () => {
    try {
      const { list } = await lumi.entities.especialidades.list({
        sort: { ordem: -1 },
        limit: 1
      })
      return list && list.length > 0 ? (list[0].ordem || 0) + 1 : 1
    } catch (error) {
      return 1
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
            to="/admin/especialidades"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Editar Especialidade' : 'Nova Especialidade'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Edite as informações da especialidade' : 'Cadastre uma nova área de especialização'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Especialidade *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: Terapia Cognitivo-Comportamental"
              />
            </div>

            {/* Ícone */}
            <div>
              <label htmlFor="icone" className="block text-sm font-medium text-gray-700 mb-2">
                Ícone (Emoji) *
              </label>
              <input
                type="text"
                id="icone"
                name="icone"
                required
                value={formData.icone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="🧠"
                maxLength={2}
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
                rows={2}
                value={formData.resumo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Resumo breve da especialidade"
              />
            </div>

            {/* Duração */}
            <div>
              <label htmlFor="duracao" className="block text-sm font-medium text-gray-700 mb-2">
                Duração Típica *
              </label>
              <input
                type="text"
                id="duracao"
                name="duracao"
                required
                value={formData.duracao}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: 12 a 20 sessões"
              />
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ativo"
                name="ativo"
                checked={formData.ativo}
                onChange={handleInputChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                Especialidade ativa
              </label>
            </div>

            {/* Imagem */}
            <div className="lg:col-span-2">
              <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem *
              </label>
              <input
                type="url"
                id="imagem"
                name="imagem"
                required
                value={formData.imagem}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            {/* Metodologia */}
            <div className="lg:col-span-2">
              <label htmlFor="metodologia" className="block text-sm font-medium text-gray-700 mb-2">
                Metodologia *
              </label>
              <textarea
                id="metodologia"
                name="metodologia"
                required
                rows={3}
                value={formData.metodologia}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Descreva a metodologia utilizada"
              />
            </div>

            {/* Descrição */}
            <div className="lg:col-span-2">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Completa *
              </label>
              <textarea
                id="descricao"
                name="descricao"
                required
                rows={6}
                value={formData.descricao}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Descrição detalhada da especialidade"
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            to="/admin/especialidades"
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
                {isEdit ? 'Atualizar' : 'Criar'} Especialidade
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminEspecialidades
