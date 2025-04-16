import React from 'react';
import { ClipboardList, BarChart, FileText } from 'lucide-react';

export const DemoSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Como Funciona</h2>
          <p className="mt-4 text-lg text-gray-600">
            Processo simplificado e eficiente de avaliação
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Questionário */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="relative mb-6">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
                alt="Questionário HSE-IT"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full">
                <ClipboardList className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Questionário Completo
            </h3>
            <p className="text-gray-600">
              35 perguntas cuidadosamente elaboradas para avaliar todos os aspectos relevantes de HSE em TI
            </p>
          </div>

          {/* Progresso */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="relative mb-6">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                alt="Acompanhamento de Progresso"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-green-600 text-white p-2 rounded-full">
                <BarChart className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Acompanhamento em Tempo Real
            </h3>
            <p className="text-gray-600">
              Monitore o progresso das avaliações com indicadores claros e atualizados instantaneamente
            </p>
          </div>

          {/* Relatório */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="relative mb-6">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                alt="Relatório Detalhado"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-purple-600 text-white p-2 rounded-full">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Relatório Completo
            </h3>
            <p className="text-gray-600">
              Resultados apresentados em gráficos intuitivos, com recomendações personalizadas e exportação em PDF
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};