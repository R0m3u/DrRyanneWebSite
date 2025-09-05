
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Search, Calendar, Eye, Tag} from 'lucide-react'
import { lumi } from '../lib/lumi'

interface Artigo {
  _id:            string
  titulo:         string
  resumo:         string
  categoria:      string
  tags:           string[]
  imagemCapa:     string
  dataPublicacao: string
  visualizacoes:  number
}

const Artigos: React.FC = () => {
  const [artigos,          setArtigos]          = useState<Artigo[]>([])
  const [filteredArtigos,  setFilteredArtigos]  = useState<Artigo[]>([])
  const [loading,          setLoading]          = useState(true)
  const [searchTerm,       setSearchTerm]       = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categorias = [
    { value: '',                    label: 'Todas as categorias' },
    { value: 'ansiedade',           label: 'Ansiedade'           },
    { value: 'depressao',           label: 'Depressão'           },
    { value: 'relacionamentos',     label: 'Relacionamentos'     },
    { value: 'autoestima',          label: 'Autoestima'          },
    { value: 'stress',              label: 'Estresse'            },
    { value: 'terapia',             label: 'Terapia'             },
    { value: 'psicologia-infantil', label: 'Psicologia Infantil' },
    { value: 'outros',              label: 'Outros'              }
  ]

  useEffect(() => {
    const fetchArtigos = async () => {
      try {
        const { list } = await lumi.entities.artigos.list({
          filter: { status: 'publicado' },
          sort: { dataPublicacao: -1 }
        })
        setArtigos(list || [])
        setFilteredArtigos(list || [])
      } catch (error) {
        console.error('Erro ao carregar artigos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtigos()
  }, [])

  useEffect(() => {
    let filtered = artigos

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(artigo => artigo.categoria === selectedCategory)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(artigo =>
        artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artigo.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artigo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredArtigos(filtered)
  }, [artigos, searchTerm, selectedCategory])

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
            Artigos sobre Saúde Mental
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conteúdo especializado para apoiar seu desenvolvimento pessoal e bem-estar emocional.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Categoria */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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

        {/* Resultados */}
        {filteredArtigos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm || selectedCategory
                ? 'Nenhum artigo encontrado com os filtros selecionados.'
                : 'Nenhum artigo publicado ainda.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-gray-600">
                {filteredArtigos.length} {filteredArtigos.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtigos.map((artigo, index) => (
                <Link
                  key={artigo._id}
                  to={`/artigos/${artigo._id}`}
                  className="card group fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={artigo.imagemCapa}
                      alt={artigo.titulo}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(artigo.categoria)}`}>
                        {getCategoryLabel(artigo.categoria)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR')}
                      <Eye className="w-4 h-4 ml-4 mr-1" />
                      {artigo.visualizacoes}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {artigo.titulo}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {artigo.resumo}
                    </p>

                    {artigo.tags && artigo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {artigo.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {artigo.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{artigo.tags.length - 3} mais
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Artigos
