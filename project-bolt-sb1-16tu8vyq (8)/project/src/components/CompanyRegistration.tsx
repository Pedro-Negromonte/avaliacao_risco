import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Building2, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { validateCNPJ, formatCNPJ } from '../utils/validators';
import { Company } from '../types/company';
import { supabase } from '../lib/supabase';

const validationSchema = Yup.object().shape({
  razaoSocial: Yup.string()
    .required('Razão Social é obrigatória')
    .min(3, 'Razão Social deve ter no mínimo 3 caracteres'),
  cnpj: Yup.string()
    .required('CNPJ é obrigatório')
    .test('cnpj', 'CNPJ inválido', value => validateCNPJ(value || '')),
  quantidadeFuncionarios: Yup.number()
    .required('Quantidade de funcionários é obrigatória')
    .min(1, 'Deve haver pelo menos 1 funcionário')
    .max(100000, 'Número muito alto')
    .integer('Deve ser um número inteiro')
});

interface CompanyRegistrationProps {
  onRegistrationComplete: (company: Company) => void;
}

export const CompanyRegistration: React.FC<CompanyRegistrationProps> = ({
  onRegistrationComplete
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError(null);
      
      const company: Company = {
        razaoSocial: values.razaoSocial,
        cnpj: values.cnpj.replace(/\D/g, ''),
        quantidadeFuncionarios: values.quantidadeFuncionarios,
        valorTotal: values.quantidadeFuncionarios * 10, // R$ 10 por funcionário
        dataExpiracao: new Date(new Date().getFullYear(), 11, 31).toISOString(), // 31/12 do ano atual
        status: 'PENDENTE',
        avaliacoesDisponiveis: values.quantidadeFuncionarios,
        avaliacoesRealizadas: 0
      };

      const { data, error: saveError } = await supabase
        .from('empresas')
        .insert([company])
        .select()
        .single();

      if (saveError) throw saveError;

      onRegistrationComplete(data);
    } catch (err) {
      console.error('Erro ao registrar empresa:', err);
      setError('Erro ao registrar empresa. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
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
          quantidadeFuncionarios: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <div>
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

            <div>
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

            <div>
              <label
                htmlFor="quantidadeFuncionarios"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantidade de Funcionários
              </label>
              <Field
                type="number"
                id="quantidadeFuncionarios"
                name="quantidadeFuncionarios"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 100"
              />
              {errors.quantidadeFuncionarios && touched.quantidadeFuncionarios && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.quantidadeFuncionarios}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  Continuar para Pagamento
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};