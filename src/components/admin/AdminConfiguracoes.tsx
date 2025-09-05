
import React, { useState, useEffect } from 'react'
import {Save, User, Mail, Phone, MapPin, Instagram} from 'lucide-react'
import toast from 'react-hot-toast'
import { lumi } from '../../lib/lumi'

interface Configuracao {
  chave: string
  valor: string
  descricao: string
  tipo: string
  categoria: string
}

const AdminConfiguracoes: React.FC = () => {
  const [configuracoes, setConfiguracoes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const configFields = [
    // Perfil
    {
      key: 'nome_psicologa',
      label: 'Nome Completo',
      type: 'text',
      category: 'perfil',
      icon: User,
      placeholder: 'Dra. Ana Silva'
    },
    {
      key: 'crp',
      label: 'CRP',
      type: 'text',
      category: 'perfil',
      icon: User,
      placeholder: 'CRP 06/123456'
    },
    {
      key: 'bio',
      label: 'Biografia Profissional',
      type: 'textarea',
      category: 'perfil',
      icon: User,
      placeholder: 'Psicóloga clínica com mais de 10 anos de experiência...'
    },
    {
      key: 'foto_perfil',
      label: 'URL da Foto de Perfil',
      type: 'url',
      category: 'perfil',
      icon: User,
      placeholder: 'https://exemplo.com/foto.jpg'
    },
    // Contato
    {
      key: 'telefone',
      label: 'Telefone',
      type: 'tel',
      category: 'contato',
      icon: Phone,
      placeholder: '(11) 99999-9999'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      category: 'contato',
      icon: Mail,
      placeholder: 'contato@draanasilva.com.br'
    },
    {
      key: 'endereco',
      label: 'Endereço do Consultório',
      type: 'text',
      category: 'contato',
      icon: MapPin,
      placeholder: 'Rua das Flores, 123 - Jardins, São Paulo - SP'
    },
    // Redes Sociais
    {
      key: 'instagram',
      label: 'Instagram',
      type: 'text',
      category: 'redes-sociais',
      icon: Instagram,
      placeholder: '@draanasilva'
    }
  ]

  useEffect(() => {
    fetchConfiguracoes()
  }, [])

  const fetchConfiguracoes = async () => {
    try {
      const { list } = await lumi.entities.configuracoes.list()
      const configMap = (list || []).reduce((acc: Record<string, string>, config: Configuracao) => {
        acc[config.chave] = config.valor
        return acc
      }, {})
      setConfiguracoes(configMap)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setConfiguracoes(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Buscar configurações existentes
      const { list: existingConfigs } = await lumi.entities.configuracoes.list()
      const existingMap = new Map((existingConfigs || []).map(c => [c.chave, c]))

      // Atualizar ou criar cada configuração
      const promises = configFields.map(async (field) => {
        const valor = configuracoes[field.key] || ''
        const existing = existingMap.get(field.key)

        const configData = {
          chave: field.key,
          valor,
          descricao: field.label,
          tipo: field.type,
          categoria: field.category,
          updatedAt: new Date().toISOString()
        }

        if (existing) {
          return lumi.entities.configuracoes.update(existing._id, configData)
        } else {
          return lumi.entities.configuracoes.create(configData)
        }
      })

      await Promise.all(promises)
      toast.success('Configurações salvas com sucesso')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const groupedFields = configFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = []
    }
    acc[field.category].push(field)
    return acc
  }, {} as Record<string, typeof configFields>)

  const categoryLabels = {
    'perfil': 'Informações do Perfil',
    'contato': 'Dados de Contato',
    'redes-sociais': 'Redes Sociais'
  }

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações do Site</h1>
        <p className="text-gray-600">Gerencie as informações que aparecem no seu site</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {Object.entries(groupedFields).map(([category, fields]) => (
          <div key={category} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fields.map((field) => {
                const Icon = field.icon
                return (
                  <div key={field.key} className={field.type === 'textarea' ? 'lg:col-span-2' : ''}>
                    <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{field.label}</span>
                      </div>
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.key}
                        value={configuracoes[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.key}
                        value={configuracoes[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Ações */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </form>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Informações Importantes
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• As alterações serão refletidas imediatamente no site público</p>
          <p>• Certifique-se de que todas as URLs de imagens estão corretas e acessíveis</p>
          <p>• O telefone deve estar no formato (XX) XXXXX-XXXX para melhor apresentação</p>
          <p>• A biografia será exibida na página "Sobre Mim"</p>
          <p>• O Instagram deve incluir o @ no início</p>
        </div>
      </div>
    </div>
  )
}

export default AdminConfiguracoes
