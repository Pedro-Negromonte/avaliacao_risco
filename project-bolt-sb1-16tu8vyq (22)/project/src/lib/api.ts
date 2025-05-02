import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_SUPABASE_URL;

export async function createEmpresa(data: {
  razaoSocial: string;
  cnpj: string;
  quantidadeFuncionarios: number;
}) {
  const response = await fetch(`${API_URL}/functions/v1/empresas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

export async function submitAvaliacao(empresaId: string, respostas: any[]) {
  const response = await fetch(`${API_URL}/functions/v1/avaliacoes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
    },
    body: JSON.stringify({
      empresaId,
      respostas
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

export async function getAvaliacoes(empresaId: string) {
  const response = await fetch(`${API_URL}/functions/v1/avaliacoes?empresaId=${empresaId}`, {
    headers: {
      'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}