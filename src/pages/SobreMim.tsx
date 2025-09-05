
import React, { useState, useEffect } from 'react'
import {GraduationCap, Award, Heart, Users, BookOpen, Clock} from 'lucide-react'
import { lumi } from '../lib/lumi'

interface Configuracao {
  chave: string
  valor: string
}

const SobreMim: React.FC = () => {
  const [configuracoes, setConfiguracoes] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        const { list } = await lumi.entities.configuracoes.list({
          filter: { categoria: 'perfil' }
        })
        
        const configMap = (list || []).reduce((acc: Record<string, string>, config: Configuracao) => {
          acc[config.chave] = config.valor
          return acc
        }, {})
        
        setConfiguracoes(configMap)
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }

    fetchConfiguracoes()
  }, [])

  const formacoes = [
    {
      titulo: "Graduação em Psicologia",
      instituicao: "Universidade de São Paulo (USP)",
      ano: "2012",
      icone: <GraduationCap className="w-6 h-6" />
    },
    {
      titulo: "Mestrado em Psicologia Clínica",
      instituicao: "Universidade de São Paulo (USP)",
      ano: "2015",
      icone: <Award className="w-6 h-6" />
    },
    {
      titulo: "Pós-graduação em TCC",
      instituicao: "Instituto Beck",
      ano: "2016",
      icone: <BookOpen className="w-6 h-6" />
    },
    {
      titulo: "Especialização em Terapia de Casal",
      instituicao: "Instituto de Terapia de Casal",
      ano: "2018",
      icone: <Heart className="w-6 h-6" />
    }
  ]

  const abordagens = [
    {
      nome: "Terapia Cognitivo-Comportamental",
      descricao: "Abordagem focada na identificação e modificação de padrões de pensamento e comportamento disfuncionais."
    },
    {
      nome: "Terapia Humanística",
      descricao: "Enfoque no crescimento pessoal, autoaceitação e desenvolvimento do potencial humano."
    },
    {
      nome: "Mindfulness",
      descricao: "Técnicas de atenção plena para redução do estresse e maior consciência do momento presente."
    },
    {
      nome: "Terapia Sistêmica",
      descricao: "Trabalho com dinâmicas familiares e relacionais para promover mudanças positivas."
    }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Sobre Mim
            </h1>
            <h2 className="text-2xl font-semibold text-teal-600 mb-4">
              {configuracoes.nome_psicologa || 'Dra. Ana Silva'}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {configuracoes.crp || 'CRP 06/123456'}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {configuracoes.bio || 'Psicóloga clínica com mais de 10 anos de experiência em Terapia Cognitivo-Comportamental. Especializada no tratamento de ansiedade, depressão e terapia de casal.'}
            </p>
          </div>
          
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={configuracoes.foto_perfil || "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg"}
                alt={configuracoes.nome_psicologa || "Dra. Ana Silva"}
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full opacity-20 animate-float"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Missão e Valores */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-600">
                Promover o bem-estar emocional e o desenvolvimento pessoal através de um atendimento humanizado e baseado em evidências científicas.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Valores</h3>
              <p className="text-gray-600">
                Empatia, respeito, confidencialidade e compromisso com o crescimento pessoal de cada paciente.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Experiência</h3>
              <p className="text-gray-600">
                Mais de 10 anos de experiência clínica, com centenas de pacientes atendidos e resultados comprovados.
              </p>
            </div>
          </div>
        </section>

        {/* Formação Acadêmica */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Formação Acadêmica
            </h2>
            <p className="text-xl text-gray-600">
              Sólida formação acadêmica e especialização contínua
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formacoes.map((formacao, index) => (
              <div key={index} className="card p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  {formacao.icone}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {formacao.titulo}
                  </h3>
                  <p className="text-gray-600 mb-1">{formacao.instituicao}</p>
                  <p className="text-sm text-teal-600 font-medium">{formacao.ano}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Abordagens Terapêuticas */}
        <section className="mb-20 gradient-bg rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Abordagens Terapêuticas
            </h2>
            <p className="text-xl text-gray-600">
              Metodologias baseadas em evidências científicas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {abordagens.map((abordagem, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {abordagem.nome}
                </h3>
                <p className="text-gray-600">
                  {abordagem.descricao}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Filosofia de Trabalho */}
        <section className="text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              Minha Filosofia de Trabalho
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                "Acredito que cada pessoa possui recursos internos únicos para superar suas dificuldades e alcançar uma vida mais plena e satisfatória. Meu papel como psicóloga é criar um ambiente seguro e acolhedor onde você possa explorar seus sentimentos, compreender seus padrões de comportamento e desenvolver estratégias eficazes para lidar com os desafios da vida."
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                "Utilizo uma abordagem integrativa, combinando técnicas da Terapia Cognitivo-Comportamental com elementos humanísticos, sempre respeitando a individualidade e o ritmo de cada paciente. Juntos, construiremos um caminho personalizado para seu crescimento pessoal e bem-estar emocional."
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SobreMim
