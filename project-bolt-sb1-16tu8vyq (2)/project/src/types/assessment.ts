export interface Question {
  id: number;
  text: string;
  domain: Domain;
  icon: any; // Lucide icon component type
  tooltip: string;
}

export type Domain = 
  | 'DEMANDA'
  | 'CONTROLE'
  | 'SUPORTE_GESTAO'
  | 'SUPORTE_PARES'
  | 'RELACIONAMENTOS'
  | 'FUNCAO'
  | 'MUDANCA';

export interface Assessment {
  id: number;
  empresaId: number;
  respostas: Response[];
  criadoEm: string;
}

export interface Response {
  perguntaId: number;
  valor: number;
}

export interface RiskLevel {
  nivel: 'ALTO' | 'MODERADO' | 'BAIXO';
  pontuacao: number;
}

export interface DomainResult {
  dominio: Domain;
  media: number;
  nivelRisco: RiskLevel;
  recomendacoes: string[];
}

export interface CompanyInfo {
  totalEmployees: number;
  completedAssessments: number;
  requiredAssessments: number;
  progressPercentage: number;
}