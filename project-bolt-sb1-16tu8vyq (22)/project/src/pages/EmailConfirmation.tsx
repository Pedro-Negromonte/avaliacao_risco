import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Mail, AlertCircle } from 'lucide-react';

export const EmailConfirmation: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/cadastro" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Confirme seu email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enviamos um link de confirmação para
          </p>
          <p className="mt-1 text-center text-lg font-medium text-gray-900">
            {email}
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Instruções
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Verifique sua caixa de entrada</li>
                    <li>Clique no link de confirmação no email</li>
                    <li>Caso não encontre, verifique a pasta de spam</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Após confirmar seu email, você poderá acessar a área do cliente
              e continuar com o processo de pagamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};