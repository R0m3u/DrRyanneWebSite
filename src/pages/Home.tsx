
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {ArrowRight, Heart, Users, Clock, Star, Play, BookOpen} from 'lucide-react'
import { lumi } from '../lib/lumi'

interface Especialidade {
  _id: string
  nome: string
  resumo: string
  icone: string
  imagem: string
}

interface Video {
  _id: string
  titulo: string
  thumbnail: string
  duracao: string
  visualizacoes: number
}

interface Artigo {
  _id: string
  titulo: string
  resumo: string
  imagemCapa: string
  dataPublicacao: string
}

const Home: React.FC = () => {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [videosDestaque, setVideosDestaque] = useState<Video[]>([])
  const [artigosRecentes, setArtigosRecentes] = useState<Artigo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar especialidades ativas
        const { list: especialidadesList } = await lumi.entities.especialidades.list({
          filter: { ativo: true },
          sort: { ordem: 1 },
          limit: 3
        })
        setEspecialidades(especialidadesList || [])

        // Buscar vídeos em destaque
        const { list: videosList } = await lumi.entities.videos.list({
          filter: { status: 'publicado', destaque: true },
          sort: { dataPublicacao: -1 },
          limit: 2
        })
        setVideosDestaque(videosList || [])

        // Buscar artigos recentes
        const { list: artigosList } = await lumi.entities.artigos.list({
          filter: { status: 'publicado' },
          sort: { dataPublicacao: -1 },
          limit: 3
        })
        setArtigosRecentes(artigosList || [])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Cuidando da sua
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"> saúde mental</span>
                com carinho
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Ofereço atendimento psicológico humanizado e acolhedor, utilizando abordagens baseadas em evidências científicas para promover seu bem-estar emocional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contato" className="btn-primary inline-flex items-center justify-center">
                  Agendar Consulta
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/sobre-mim" className="btn-secondary inline-flex items-center justify-center">
                  Conhecer Mais
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg"
                  alt="Dra. Ana Silva - Psicóloga"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Pacientes atendidos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10+</h3>
              <p className="text-gray-600">Anos de experiência</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">98%</h3>
              <p className="text-gray-600">Satisfação dos pacientes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Minhas Especialidades
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Atendimento especializado em diversas áreas da psicologia clínica, sempre com uma abordagem humanizada e baseada em evidências científicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {especialidades.map((especialidade, index) => (
              <div key={especialidade._id} className="card p-6 text-center" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-4xl mb-4">{especialidade.icone}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{especialidade.nome}</h3>
                <p className="text-gray-600 mb-4">{especialidade.resumo}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/especialidades" className="btn-primary inline-flex items-center">
              Ver Todas as Especialidades
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vídeos em Destaque */}
      {videosDestaque.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Vídeos em Destaque
              </h2>
              <p className="text-xl text-gray-600">
                Conteúdo educativo para apoiar seu desenvolvimento pessoal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {videosDestaque.map((video) => (
                <div key={video._id} className="card overflow-hidden group cursor-pointer">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.titulo}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {video.duracao}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.titulo}</h3>
                    <p className="text-gray-600 text-sm">{video.visualizacoes} visualizações</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/videos" className="btn-secondary inline-flex items-center">
                <Play className="mr-2 w-5 h-5" />
                Ver Todos os Vídeos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Artigos Recentes */}
      {artigosRecentes.length > 0 && (
        <section className="py-20 gradient-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Artigos Recentes
              </h2>
              <p className="text-xl text-gray-600">
                Conteúdo especializado sobre saúde mental e bem-estar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {artigosRecentes.map((artigo) => (
                <Link key={artigo._id} to={`/artigos/${artigo._id}`} className="card group">
                  <img
                    src={artigo.imagemCapa}
                    alt={artigo.titulo}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <p className="text-sm text-teal-600 mb-2">
                      {new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR')}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                      {artigo.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm">{artigo.resumo}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link to="/artigos" className="btn-secondary inline-flex items-center">
                <BookOpen className="mr-2 w-5 h-5" />
                Ver Todos os Artigos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Pronto para dar o primeiro passo?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Agende sua consulta e comece sua jornada rumo ao bem-estar emocional
          </p>
          <Link to="/contato" className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 inline-flex items-center">
            Agendar Consulta
            <Heart className="ml-2 w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
