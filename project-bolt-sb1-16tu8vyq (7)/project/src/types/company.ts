export interface Company {
  id?: string;
  razaoSocial: string;
  cnpj: string;
  planoId?: string;
  quantidadeFuncionarios: number;
  valorTotal: number;
  dataExpiracao: string;
  status: 'PENDENTE' | 'ATIVO' | 'EXPIRADO';
  avaliacoesDisponiveis: number;
  avaliacoesRealizadas: number;
}

export interface Plan {
  id: string;
  nome: string;
  valorPorFuncionario: number;
  descricao: string;
}