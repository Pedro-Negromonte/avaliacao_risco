import React from 'react';
import { QuestionnaireHSE } from './components/QuestionnaireHSE';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">
            Sistema de Avaliação de Riscos HSE-IT
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <QuestionnaireHSE />
      </main>
    </div>
  );
}

export default App;