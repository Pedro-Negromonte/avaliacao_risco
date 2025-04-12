import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Users } from 'lucide-react';

interface EmployeeCountFormProps {
  onSubmit: (employeeCount: number) => void;
}

const validationSchema = Yup.object().shape({
  employeeCount: Yup.number()
    .required('Obrigatório')
    .min(1, 'Deve haver pelo menos 1 funcionário')
    .max(100000, 'Número muito alto')
    .integer('Deve ser um número inteiro'),
});

export const EmployeeCountForm: React.FC<EmployeeCountFormProps> = ({ onSubmit }) => {
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Users className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Configuração Inicial
        </h1>
        <p className="text-gray-600">
          Por favor, informe o número total de funcionários da empresa
        </p>
      </div>

      <Formik
        initialValues={{ employeeCount: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(Number(values.employeeCount))}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label
                htmlFor="employeeCount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de Funcionários
              </label>
              <Field
                type="number"
                id="employeeCount"
                name="employeeCount"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 100"
              />
              {errors.employeeCount && touched.employeeCount && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.employeeCount}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continuar
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};