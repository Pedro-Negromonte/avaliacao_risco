import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, FileCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Company {
  id: string;
  razao_social: string;
  avaliacoes_disponiveis: number;
  avaliacoes_realizadas: number;
  status: string;
}

export const ClientArea: React.FC = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const { data: company, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', 'c81d4e2e-bcf2-4c1a-b275-9183a9f6a176')
        .single();

      if (error) throw error;
      setCompany(company);
    } catch (err) {
      console.error('Erro ao carregar dados da empresa:', err);
      setError('Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = () => {
    navigate('/assessment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Erro ao carregar dados
          </h2>
          <p className="text-gray-600 text-center">
            {error || 'Empresa não encontrada'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-lg font-semibold text-gray-900">
                Área do Cliente
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {company.razao_social}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="ml-2 text-gray-600">Avaliações Disponíveis:</span>
                  <span className="ml-auto font-semibold">{company.avaliacoes_disponiveis}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileCheck className="h-5 w-5 text-green-600" />
                  <span className="ml-2 text-gray-600">Avaliações Realizadas:</span>
                  <span className="ml-auto font-semibold">{company.avaliacoes_realizadas}</span>
                </div>
              </div>
            </div>
          </div>

          {company.status === 'ATIVO' && company.avaliacoes_realizadas < company.avaliacoes_disponiveis && (
            <button
              onClick={startAssessment}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Iniciar Nova Avaliação
            </button>
          )}

          {company.status !== 'ATIVO' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Aguardando confirmação do pagamento para liberar as avaliações.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};