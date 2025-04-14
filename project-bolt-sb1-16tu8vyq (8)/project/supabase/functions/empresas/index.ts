import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (req.method === 'POST') {
      const { razaoSocial, cnpj, quantidadeFuncionarios } = await req.json();

      // Validar CNPJ
      if (!validateCNPJ(cnpj)) {
        throw new Error('CNPJ inválido');
      }

      // Calcular valores
      const valorTotal = quantidadeFuncionarios * 10;
      const dataExpiracao = new Date(new Date().getFullYear(), 11, 31).toISOString();

      // Criar empresa
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .insert([{
          nome: razaoSocial,
          avaliacoes_disponiveis: quantidadeFuncionarios,
          avaliacoes_realizadas: 0
        }])
        .select()
        .single();

      if (empresaError) throw empresaError;

      // Criar assinatura
      const { error: assinaturaError } = await supabase
        .from('assinatura_empresa')
        .insert([{
          empresa_id: empresa.id,
          valor_total: valorTotal,
          data_expiracao: dataExpiracao,
          status: 'PENDENTE'
        }]);

      if (assinaturaError) throw assinaturaError;

      return new Response(
        JSON.stringify({ success: true, data: empresa }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          *,
          assinatura_empresa (*)
        `);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Método não suportado');

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

// Função de validação de CNPJ
function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(1))) return false;

  return true;
}