import { Response, RiskLevel, Domain, DomainResult } from '../types/assessment';

export const calculateRiskLevel = (average: number): RiskLevel => {
  if (average <= 2) {
    return { nivel: 'ALTO', pontuacao: average };
  } else if (average <= 3) {
    return { nivel: 'MODERADO', pontuacao: average };
  } else {
    return { nivel: 'BAIXO', pontuacao: average };
  }
};

export const calculateDomainResults = (respostas: Response[], domainQuestions: Record<Domain, number[]>): DomainResult[] => {
  const results: DomainResult[] = [];

  Object.entries(domainQuestions).forEach(([domain, questionIds]) => {
    const domainResponses = respostas.filter(r => questionIds.includes(r.perguntaId));
    const average = domainResponses.reduce((sum, r) => sum + r.valor, 0) / domainResponses.length;
    
    const riskLevel = calculateRiskLevel(average);
    const recomendacoes = getRecommendations(domain as Domain, riskLevel.nivel);

    results.push({
      dominio: domain as Domain,
      media: average,
      nivelRisco: riskLevel,
      recomendacoes
    });
  });

  return results;
};

const getRecommendations = (domain: Domain, riskLevel: 'ALTO' | 'MODERADO' | 'BAIXO'): string[] => {
  const recommendations: Record<Domain, Record<string, string[]>> = {
    DEMANDA: {
      ALTO: [
        'Revisar a distribuição de tarefas e prazos',
        'Implementar gestão de prioridades',
        'Avaliar necessidade de contratações'
      ],
      MODERADO: [
        'Monitorar carga de trabalho periodicamente',
        'Estabelecer metas realistas'
      ],
      BAIXO: [
        'Manter práticas atuais de gestão de demanda'
      ]
    },
    // Adicione recomendações para outros domínios aqui
  };

  return recommendations[domain]?.[riskLevel] || ['Realizar análise detalhada do domínio'];
};