import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { validateCNPJ } from '../utils/validators';
import { supabase } from '../lib/supabase';

const validationSchema = Yup.object().shape({
  cnpj: Yup.string()
    .required('CNPJ é obrigatório')
    .test('cnpj', 'CNPJ inválido', value => validateCNPJ(value || '')),
  password: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
});

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError(null);

      const { data: company, error: companyError } = await supabase
        .from('empresas')
        .select('*')
        .eq('cnpj', values.cnpj.replace(/\D/g, ''))
        .single();

      if (companyError || !company) {
        throw new Error('CNPJ não encontrado');
      }

      if (company.status !== 'ATIVO') {
        throw new Error('Empresa aguardando confirmação de pagamento');
      }

      // Aqui você pode adicionar a lógica de verificação da senha
      if (values.password !== company.access_password) {
        throw new Error('Senha incorreta');
      }

      navigate('/area-cliente');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <LogIn className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Área do Cliente
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Acesse sua conta para realizar as avaliações
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <Formik
          initialValues={{
            cnpj: '',
            password: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="cnpj" className="sr-only">
                    CNPJ
                  </label>
                  <Field
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    placeholder="CNPJ"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  />
                  {errors.cnpj && touched.cnpj && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.cnpj}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Senha
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Senha"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Entrar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};