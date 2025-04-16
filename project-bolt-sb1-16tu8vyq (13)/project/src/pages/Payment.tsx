import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, AlertCircle, Users, Loader2 } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../lib/supabase';

const validationSchema = Yup.object().shape({
  employeeCount: Yup.number()
    .required('Quantidade de funcionários é obrigatória')
    .min(1, 'Mínimo de 1 funcionário')
    .max(10000, 'Máximo de 10.000 funcionários')
});

export const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { companyId, razaoSocial, cnpj, email } = location.state || {};

  const calculateTotal = (employeeCount: number) => employeeCount * 10;

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError(null);
      setLoading(true);

      // Atualizar empresa com a quantidade de avaliações
      const { error: updateError } = await supabase
        .from('empresas')
        .update({
          avaliacoes_disponiveis: values.employeeCount,
          avaliacoes_realizadas: 0
        })
        .eq('id', companyId);

      if (updateError) throw updateError;

      // Criar assinatura
      const { error: subscriptionError } = await supabase
        .from('assinatura_empresa')
        .insert([{
          empresa_id: companyId,
          valor_total: calculateTotal(values.employeeCount),
          data_expiracao: new Date(new Date().getFullYear(), 11, 31).toISOString(),
          status: 'PENDENTE'
        }]);

      if (subscriptionError) throw subscriptionError;

      // Criar pagamento no ASAAS
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          companyId,
          employeeCount: values.employeeCount,
          razaoSocial,
          cnpj,
          email
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao processar pagamento');
      }

      const { paymentUrl } = await response.json();

      // Redirecionar para a página de pagamento do ASAAS
      window.location.href = paymentUrl;

    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento');
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (!companyId || !razaoSocial || !cnpj || !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Dados inválidos. Por favor, faça o cadastro novamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CreditCard className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento
          </h1>
          <p className="text-gray-600">
            Configure a quantidade de avaliações
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Dados da Empresa
            </h2>
            <p className="text-gray-600">{razaoSocial}</p>
            <p className="text-gray-600">{cnpj}</p>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>

        <Formik
          initialValues={{
            employeeCount: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className="bg-white shadow rounded-lg p-6">
              <div className="mb-6">
                <label
                  htmlFor="employeeCount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantidade de Funcionários
                </label>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <Field
                    type="number"
                    id="employeeCount"
                    name="employeeCount"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 100"
                  />
                </div>
                {errors.employeeCount && touched.employeeCount && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.employeeCount}
                  </div>
                )}
              </div>

              {values.employeeCount && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valor por funcionário:</span>
                    <span className="font-semibold">R$ 10,00</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      R$ {calculateTotal(Number(values.employeeCount)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  'Prosseguir para Pagamento'
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};