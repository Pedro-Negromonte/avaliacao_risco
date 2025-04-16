import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const asaasApiKey = ',22Q$]0<IAja>Us>//yMQU2j]Ro5wH';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { event, payment } = await req.json();

    // Validar a autenticação do webhook
    const webhookToken = req.headers.get('asaas-access-token');
    if (webhookToken !== asaasApiKey) {
      throw new Error('Token de autenticação inválido');
    }

    switch (event) {
      case 'PAYMENT_CONFIRMED': {
        const { data: subscription, error } = await supabase
          .from('assinatura_empresa')
          .update({ status: 'ATIVO' })
          .eq('asaas_id', payment.subscription)
          .select('empresa_id')
          .single();

        if (error) throw error;

        // Ativar a assinatura da empresa
        await supabase
          .from('empresas')
          .update({ status: 'ATIVO' })
          .eq('id', subscription.empresa_id);

        break;
      }

      case 'PAYMENT_RECEIVED': {
        // Atualizar status do pagamento como recebido
        await supabase
          .from('assinatura_empresa')
          .update({ status: 'PAGO' })
          .eq('asaas_id', payment.subscription);
        break;
      }

      case 'PAYMENT_OVERDUE': {
        // Marcar pagamento como atrasado
        await supabase
          .from('assinatura_empresa')
          .update({ status: 'ATRASADO' })
          .eq('asaas_id', payment.subscription);
        break;
      }

      case 'PAYMENT_DELETED': {
        // Marcar assinatura como cancelada
        await supabase
          .from('assinatura_empresa')
          .update({ status: 'CANCELADO' })
          .eq('asaas_id', payment.subscription);
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});