import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, FileCheck, BarChart, Clock, CheckCircle, LogIn } from 'lucide-react';
import { DemoSection } from '../components/DemoSection';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">HSE-IT</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Área do Cliente
              </button>
              <button
                onClick={() => navigate('/cadastro')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Cadastrar Empresa
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Avaliação de Riscos HSE-IT
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema especializado para avaliação de riscos em Saúde, Segurança e Meio Ambiente
              na área de Tecnologia da Informação.
            </p>
          </div>
        </div>
      </header>

      {/* Demo Section */}
      <DemoSection />

      {/* Pricing Section */}
      <section className="py-16 bg-white" id="precos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Preços Transparentes</h2>
            <p className="mt-4 text-lg text-gray-600">
              Investimento por funcionário avaliado
            </p>
          </div>
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex justify-center items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">R$ 10</span>
                <span className="ml-1 text-xl text-gray-500">/funcionário</span>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-3 text-gray-600">Avaliação completa por funcionário</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-3 text-gray-600">Relatório detalhado</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-3 text-gray-600">Recomendações personalizadas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-3 text-gray-600">Suporte técnico</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/cadastro')}
                className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Por que escolher nossa plataforma?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Avaliação Personalizada"
              description="Questionários adaptados às necessidades específicas da sua empresa"
            />
            <FeatureCard
              icon={FileCheck}
              title="Relatórios Detalhados"
              description="Análises completas com recomendações práticas"
            />
            <FeatureCard
              icon={BarChart}
              title="Métricas Precisas"
              description="Indicadores claros para tomada de decisão"
            />
            <FeatureCard
              icon={Clock}
              title="Rápido e Eficiente"
              description="Processo otimizado para economizar seu tempo"
            />
            <FeatureCard
              icon={Shield}
              title="Segurança Garantida"
              description="Dados protegidos com os mais altos padrões"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Conformidade"
              description="Alinhado com as principais normas do setor"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 HSE Assessment. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.FC<any>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};