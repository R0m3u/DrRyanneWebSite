
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Eye, Tag, ArrowLeft, ArrowRight } from 'lucide-react'
import { lumi } from '../lib/lumi'

interface Artigo {
  _id: string
  titulo: string
  resumo: string
  conteudo: string
  categoria: string
  tags: string[]
  imagemCapa: string
  dataPublicacao: string
  visualizacoes: number
  autor: string
}

const ArtigoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [artigo, setArtigo] = useState<Artigo | null>(null)
  const [artigosRelacionados, setArtigosRelacionados] = useState<Artigo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchArtigo = async () => {
      try {
        // Buscar artigo
        const artigoData = await lumi.entities.artigos.get(id)
        setArtigo(artigoData)

        // Incrementar visualizações
        await lumi.entities.artigos.update(id, {
          visualizacoes: (artigoData.visualizacoes || 0) + 1
        })

        // Buscar artigos relacionados da mesma categoria
        const { list } = await lumi.entities.artigos.list({
          filter: { 
            status: 'publicado',
            categoria: artigoData.categoria,
            _id: { $ne: id }
          },
          sort: { dataPublicacao: -1 },
          limit: 3
        })
        setArtigosRelacionados(list || [])
      } catch (error) {
        console.error('Erro ao carregar artigo:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtigo()
  }, [id])

  const getCategoryLabel = (category: string) => {
    const categorias: Record<string, string> = {
      'ansiedade':           'Ansiedade',
      'depressao':           'Depressão',
      'relacionamentos':     'Relacionamentos',
      'autoestima':          'Autoestima',
      'stress':              'Estresse',
      'terapia':             'Terapia',
      'psicologia-infantil': 'Psicologia Infantil',
      'outros':               'Outros'
    }
    return categorias[category] || category
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

  if (!artigo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
          <Link to="/artigos" className="btn-primary">
            Voltar aos Artigos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navegação */}
        <div className="mb-8">
          <Link
            to="/artigos"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Artigos
          </Link>
        </div>

        {/* Header do Artigo */}
        <article className="fade-in">
          <header className="mb-8">
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(artigo.categoria)}`}>
                {getCategoryLabel(artigo.categoria)}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {artigo.titulo}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {artigo.resumo}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {artigo.visualizacoes} visualizações
              </div>
              {artigo.autor && (
                <div>
                  Por {artigo.autor}
                </div>
              )}
            </div>

            {artigo.tags && artigo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {artigo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Imagem de Capa */}
          <div className="mb-8">
            <img
              src={artigo.imagemCapa}
              alt={artigo.titulo}
              className="w-full h-[400px] object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Conteúdo */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {artigo.conteudo.split('\n\n').map((paragrafo, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragrafo.trim()}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Precisa de ajuda profissional?
          </h3>
          <p className="text-teal-100 mb-6">
            Agende uma consulta e comece sua jornada rumo ao bem-estar emocional.
          </p>
          <Link to="/contato" className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Agendar Consulta
          </Link>
        </div>

        {/* Artigos Relacionados */}
        {artigosRelacionados.length > 0 && (
          <section className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Artigos Relacionados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {artigosRelacionados.map((artigoRelacionado) => (
                <Link
                  key={artigoRelacionado._id}
                  to={`/artigos/${artigoRelacionado._id}`}
                  className="card group"
                >
                  <img
                    src={artigoRelacionado.imagemCapa}
                    alt={artigoRelacionado.titulo}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <p className="text-sm text-teal-600 mb-2">
                      {new Date(artigoRelacionado.dataPublicacao).toLocaleDateString('pt-BR')}
                    </p>
                    <h4 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {artigoRelacionado.titulo}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ArtigoDetalhes

