import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, AlertCircle, Loader2 } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../lib/supabase';
import { validateCNPJ, formatCNPJ } from '../utils/validators';

const validationSchema = Yup.object().shape({
  razaoSocial: Yup.string()
    .required('Razão Social é obrigatória')
    .min(3, 'Razão Social deve ter no mínimo 3 caracteres'),
  cnpj: Yup.string()
    .required('CNPJ é obrigatório')
    .test('cnpj', 'CNPJ inválido', value => validateCNPJ(value || '')),
  email: Yup.string()
    .required('Email é obrigatório')
    .email('Email inválido')
});

interface CompanyRegistrationProps {
  onRegistrationComplete: (company: any) => void;
}

export const CompanyRegistration: React.FC<CompanyRegistrationProps> = ({
  onRegistrationComplete
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError(null);
      setLoading(true);

      const cleanCNPJ = values.cnpj.replace(/\D/g, '');

      // Verificar se o CNPJ já existe
      const { data: existingCompany, error: checkError } = await supabase
        .from('empresas')
        .select('id')
        .eq('cnpj', cleanCNPJ)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar CNPJ:', checkError);
        throw new Error('Erro ao verificar CNPJ. Por favor, tente novamente.');
      }

      if (existingCompany) {
        throw new Error('CNPJ já cadastrado no sistema');
      }

      // Criar empresa
      const { data: company, error: saveError } = await supabase
        .from('empresas')
        .insert([{
          razao_social: values.razaoSocial,
          cnpj: cleanCNPJ,
          email: values.email,
          status: 'PENDENTE',
          avaliacoes_disponiveis: 0,
          avaliacoes_realizadas: 0
        }])
        .select()
        .single();

      if (saveError) {
        console.error('Erro ao salvar empresa:', saveError);
        throw new Error('Erro ao registrar empresa. Por favor, tente novamente.');
      }

      if (!company) {
        throw new Error('Erro ao criar empresa. Por favor, tente novamente.');
      }

      onRegistrationComplete(company);
    } catch (err) {
      console.error('Erro ao registrar empresa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao registrar empresa');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Building2 className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Cadastro de Empresa
        </h1>
        <p className="text-gray-600">
          Preencha os dados da sua empresa para começar
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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
          razaoSocial: '',
          cnpj: '',
          email: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label
                htmlFor="razaoSocial"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Razão Social
              </label>
              <Field
                type="text"
                id="razaoSocial"
                name="razaoSocial"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Empresa LTDA"
              />
              {errors.razaoSocial && touched.razaoSocial && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.razaoSocial}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="cnpj"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CNPJ
              </label>
              <Field
                type="text"
                id="cnpj"
                name="cnpj"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="00.000.000/0000-00"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const formatted = formatCNPJ(e.target.value);
                  setFieldValue('cnpj', formatted);
                }}
                value={values.cnpj}
              />
              {errors.cnpj && touched.cnpj && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.cnpj}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="empresa@exemplo.com"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Continuar para Pagamento'
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};