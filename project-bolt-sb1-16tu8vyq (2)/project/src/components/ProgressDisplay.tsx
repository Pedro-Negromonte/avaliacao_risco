import React from 'react';
import { CompanyInfo } from '../types/assessment';
import { Users, BarChart as ChartBar, FileCheck } from 'lucide-react';

interface ProgressDisplayProps {
  companyInfo: CompanyInfo;
  onStartNewAssessment: () => void;
}

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  companyInfo,
  onStartNewAssessment,
}) => {
  const {
    totalEmployees,
    completedAssessments,
    requiredAssessments,
    progressPercentage,
  } = companyInfo;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Progresso da Avaliação
      </h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Total de Funcionários:</span>
          </div>
          <span className="font-semibold">{totalEmployees}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Avaliações Realizadas:</span>
          </div>
          <span className="font-semibold">{completedAssessments}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartBar className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600">Avaliações Necessárias (80%):</span>
          </div>
          <span className="font-semibold">{requiredAssessments}</span>
        </div>

        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progresso</span>
            <span className="text-sm font-medium text-gray-600">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={onStartNewAssessment}
          className="w-full mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Realizar Nova Avaliação
        </button>
      </div>
    </div>
  );
};