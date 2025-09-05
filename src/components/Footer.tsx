
import React from 'react'
import {Heart, Phone, Mail, MapPin, Instagram, Clock} from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Dra. Ana Silva</h3>
                <p className="text-sm text-gray-400">Psicóloga Clínica - CRP 06/123456</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Oferecendo atendimento psicológico humanizado e acolhedor, com foco no bem-estar emocional e desenvolvimento pessoal de cada paciente.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/draanasilva"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-teal-500 hover:to-blue-500 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-teal-400" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-teal-400" />
                <span className="text-gray-300">contato@draanasilva.com.br</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-teal-400 mt-1" />
                <span className="text-gray-300">
                  Rua das Flores, 123<br />
                  Jardins, São Paulo - SP
                </span>
              </div>
            </div>
          </div>

          {/* Horário de Atendimento */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Horário de Atendimento</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-teal-400" />
                <div className="text-gray-300">
                  <p className="text-sm">Segunda a Sexta</p>
                  <p className="text-sm">8h às 18h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-teal-400" />
                <div className="text-gray-300">
                  <p className="text-sm">Sábado</p>
                  <p className="text-sm">8h às 12h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Dra. Ana Silva. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Desenvolvido com ❤️ para cuidar da sua saúde mental
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
