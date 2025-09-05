
import React, { useState, useEffect } from 'react'
import {Clock, CheckCircle, ArrowRight} from 'lucide-react'
import { Link } from 'react-router-dom'
import { lumi } from '../lib/lumi'

interface Especialidade {
  _id: string
  nome: string
  descricao: string
  resumo: string
  icone: string
  imagem: string
  duracao: string
  metodologia: string
  ordem: number
}

const Especialidades: React.FC = () => {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const { list } = await lumi.entities.especialidades.list({
          filter: { ativo: true },
          sort: { ordem: 1 }
        })
        setEspecialidades(list || [])
      } catch (error) {
        console.error('Erro ao carregar especialidades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEspecialidades()
  }, [])

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
            Minhas Especialidades
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Atendimento especializado em diversas áreas da psicologia clínica, sempre com uma abordagem humanizada e baseada em evidências científicas.
          </p>
        </div>

        {/* Especialidades Grid */}
        <div className="space-y-16">
          {especialidades.map((especialidade, index) => (
            <div
              key={especialidade._id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Imagem */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={especialidade.imagem}
                    alt={especialidade.nome}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute top-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
                    {especialidade.icone}
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''} fade-in`}>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {especialidade.nome}
                </h2>
                
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {especialidade.resumo}
                </p>

                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre esta especialidade:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {especialidade.descricao}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500">Duração</p>
                      <p className="font-medium text-gray-900">{especialidade.duracao}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500">Abordagem</p>
                      <p className="font-medium text-gray-900">Baseada em evidências</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Metodologia:</h4>
                  <p className="text-gray-700">
                    {especialidade.metodologia}
                  </p>
                </div>

                <Link
                  to="/contato"
                  className="btn-primary inline-flex items-center"
                >
                  Agendar Consulta
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Entre em contato comigo para discutirmos suas necessidades específicas. Cada pessoa é única e merece um atendimento personalizado.
            </p>
            <Link
              to="/contato"
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 inline-flex items-center"
            >
              Falar Comigo
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Especialidades
