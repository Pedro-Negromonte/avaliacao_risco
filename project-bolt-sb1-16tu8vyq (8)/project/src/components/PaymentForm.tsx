import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { CreditCard, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Company } from '../types/company';

const validationSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .required('Número do cartão é obrigatório')
    .matches(/^\d{16}$/, 'Número do cartão inválido'),
  cardName: Yup.string()
    .required('Nome no cartão é obrigatório')
    .min(3, 'Nome muito curto'),
  expiryDate: Yup.string()
    .required('Data de expiração é obrigatória')
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Data inválida (MM/YY)'),
  cvv: Yup.string()
    .required('CVV é obrigatório')
    .matches(/^\d{3,4}$/, 'CVV inválido')
});

interface PaymentFormProps {
  company: Company;
  onPaymentComplete: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  company,
  onPaymentComplete
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);
    setError(null);

    try {
      // Implement ASAAS payment integration here
      // This is a placeholder for the actual implementation
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company,
          payment: values
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao processar pagamento');
      }

      onPaymentComplete();
    } catch (err) {
      console.error('Erro no pagamento:', err);
      setError('Erro ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CreditCard className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pagamento
        </h1>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-600 mb-2">Resumo do pedido:</p>
          <p className="font-medium">{company.razaoSocial}</p>
          <p className="text-sm text-gray-500 mb-2">CNPJ: {company.cnpj}</p>
          <p className="text-sm text-gray-500">
            {company.quantidadeFuncionarios} funcionários x R$ 10,00
          </p>
          <p className="text-lg font-bold mt-2">
            Total: R$ {company.valorTotal.toFixed(2)}
          </p>
        </div>
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
          cardNumber: '',
          cardName: '',
          expiryDate: '',
          cvv: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número do Cartão
              </label>
              <Field
                type="text"
                id="cardNumber"
                name="cardNumber"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234 5678 9012 3456"
                maxLength={16}
              />
              {errors.cardNumber && touched.cardNumber && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.cardNumber}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="cardName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome no Cartão
              </label>
              <Field
                type="text"
                id="cardName"
                name="cardName"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="NOME COMO ESTÁ NO CARTÃO"
              />
              {errors.cardName && touched.cardName && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.cardName}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Validade
                </label>
                <Field
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && touched.expiryDate && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.expiryDate}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  CVV
                </label>
                <Field
                  type="text"
                  id="cvv"
                  name="cvv"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvv && touched.cvv && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.cvv}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Pagar R$ {company.valorTotal.toFixed(2)}
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};