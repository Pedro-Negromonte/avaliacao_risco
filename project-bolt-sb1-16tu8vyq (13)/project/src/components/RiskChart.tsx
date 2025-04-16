import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DomainResult } from '../types/assessment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RiskChartProps {
  results: DomainResult[];
}

export const RiskChart: React.FC<RiskChartProps> = ({ results }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Resultados da Avaliação de Risco por Domínio',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const data = {
    labels: results.map(result => result.dominio),
    datasets: [
      {
        label: 'Pontuação de Risco',
        data: results.map(result => result.media),
        backgroundColor: results.map(result => {
          switch (result.nivelRisco.nivel) {
            case 'ALTO':
              return 'rgba(255, 99, 132, 0.5)';
            case 'MODERADO':
              return 'rgba(255, 205, 86, 0.5)';
            case 'BAIXO':
              return 'rgba(75, 192, 192, 0.5)';
          }
        }),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Bar options={options} data={data} />
    </div>
  );
};