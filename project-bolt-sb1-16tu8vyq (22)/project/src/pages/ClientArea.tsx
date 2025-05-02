import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, FileCheck, AlertCircle, CreditCard, Clock, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Company {
  id: string;
  razao_social: string;
  avaliacoes_disponiveis: number;
  avaliacoes_realizadas: number;
  status: string;
  email: string;
}

interface AssinaturaEmpresa {
  status: string;
  valor_total: number | null;
}

export const ClientArea: React.FC = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [assinatura, setAssinatura] = useState<AssinaturaEmpresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailResendSuccess, setEmailResendSuccess] = useState(false);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const { data: company, error: companyError } = await supabase
        .from('empresas')
        .select(`
          *,
          assinatura_empresa (
            status,
            valor_total
          )
        `)
        .eq('id', 'c81d4e2e-bcf2-4c1a-b275-9183a9f6a176')
        .single();

      if (companyError) throw companyError;
      
      setCompany(company);
      setAssinatura(company.assinatura_empresa?.[0] || null);
    } catch (err) {
      console.error('Erro ao carregar dados da empresa:', err);
      setError('Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!company) return;

    setResendingEmail(true);
    setEmailResendSuccess(false);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-confirmation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          companyId: company.id,
          email: company.email,
          razaoSocial: company.razao_social
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao reenviar email de confirmação');
      }

      setEmailResendSuccess(true);
    } catch (err) {
      console.error('Erro ao reenviar email:', err);
      setError('Erro ao reenviar email de confirmação. Por favor, tente novamente.');
    } finally {
      setResendingEmail(false);
    }
  };

  const continuarPagamento = () => {
    navigate('/pagamento', {
      state: {
        companyId: company?.id,
        razaoSocial: company?.razao_social,
        cnpj: company?.cnpj,
        email: company?.email
      }
    });
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

            {company.status === 'PENDENTE_CONFIRMACAO' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-yellow-800">
                      Confirmação de Email Pendente
                    </h3>
                    <div className="mt-2 text-yellow-700">
                      <p>Para continuar com o cadastro, você precisa confirmar seu email.</p>
                      <p className="mt-1">Enviamos um link de confirmação para: <strong>{company.email}</strong></p>
                      
                      {emailResendSuccess && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-green-700">Email de confirmação reenviado com sucesso!</p>
                        </div>
                      )}

                      {error && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-700">{error}</p>
                        </div>
                      )}

                      <button
                        onClick={handleResendEmail}
                        disabled={resendingEmail}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resendingEmail ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            Reenviando...
                          </>
                        ) : (
                          <>
                            <Mail className="h-5 w-5 mr-2" />
                            Reenviar Email de Confirmação
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {company.status === 'PENDENTE' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-yellow-800">
                      Cadastro Pendente
                    </h3>
                    <div className="mt-2 text-yellow-700">
                      <p>Para começar a usar o sistema, você precisa:</p>
                      <ul className="list-disc ml-5 mt-2 space-y-1">
                        <li>Informar a quantidade de funcionários</li>
                        <li>Realizar o pagamento da avaliação</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={continuarPagamento}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Continuar Pagamento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
              onClick={() => navigate('/assessment')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Iniciar Nova Avaliação
            </button>
          )}
        </div>
      </main>
    </div>
  );
};