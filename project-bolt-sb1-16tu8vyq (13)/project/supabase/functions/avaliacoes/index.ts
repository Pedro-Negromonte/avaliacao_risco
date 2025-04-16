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
    if (req.method === 'POST') {
      const { empresaId, respostas } = await req.json();

      // Verificar disponibilidade de avaliações
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .select('avaliacoes_disponiveis, avaliacoes_realizadas')
        .eq('id', empresaId)
        .single();

      if (empresaError) throw empresaError;

      if (empresa.avaliacoes_realizadas >= empresa.avaliacoes_disponiveis) {
        throw new Error('Limite de avaliações atingido');
      }

      // Calcular resultados
      const resultados = calculateResults(respostas);

      // Salvar avaliação
      const { error: avaliacaoError } = await supabase
        .from('avaliacoes')
        .insert([{
          empresa_id: empresaId,
          respostas,
          resultados
        }]);

      if (avaliacaoError) throw avaliacaoError;

      // Atualizar contador de avaliações
      const { error: updateError } = await supabase
        .from('empresas')
        .update({
          avaliacoes_realizadas: empresa.avaliacoes_realizadas + 1
        })
        .eq('id', empresaId);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({ success: true, data: resultados }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const empresaId = url.searchParams.get('empresaId');

      if (!empresaId) {
        throw new Error('ID da empresa é obrigatório');
      }

      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('empresa_id', empresaId);

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

// Função para calcular resultados
function calculateResults(respostas: any[]) {
  const domainQuestions: Record<string, number[]> = {
    DEMANDA: [1, 2, 3, 4, 5, 6, 7],
    CONTROLE: [8, 9, 10, 11, 12],
    SUPORTE_GESTAO: [13, 14, 15, 16, 17],
    SUPORTE_PARES: [18, 19, 20, 21],
    RELACIONAMENTOS: [22, 23, 24, 25],
    FUNCAO: [26, 27, 28, 29, 30],
    MUDANCA: [31, 32, 33, 34, 35]
  };

  const results = Object.entries(domainQuestions).map(([domain, questionIds]) => {
    const domainResponses = respostas.filter(r => questionIds.includes(r.perguntaId));
    const average = domainResponses.reduce((sum, r) => sum + r.valor, 0) / domainResponses.length;
    
    return {
      dominio: domain,
      media: average,
      nivelRisco: calculateRiskLevel(average),
      recomendacoes: getRecommendations(domain, calculateRiskLevel(average).nivel)
    };
  });

  return results;
}

function calculateRiskLevel(average: number) {
  if (average <= 2) {
    return { nivel: 'ALTO', pontuacao: average };
  } else if (average <= 3) {
    return { nivel: 'MODERADO', pontuacao: average };
  } else {
    return { nivel: 'BAIXO', pontuacao: average };
  }
}

function getRecommendations(domain: string, riskLevel: string): string[] {
  const recommendations: Record<string, Record<string, string[]>> = {
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
    }
    // Adicione recomendações para outros domínios conforme necessário
  };

  return recommendations[domain]?.[riskLevel] || ['Realizar análise detalhada do domínio'];
}