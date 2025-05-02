import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const asaasApiKey = Deno.env.get('ASAAS_API_KEY')!;
const asaasApiUrl = 'https://sandbox.asaas.com/api/v3'; // Usar https://api.asaas.com para produção

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyId, employeeCount, razaoSocial, cnpj, email } = await req.json();

    if (!companyId || !employeeCount || !razaoSocial || !cnpj || !email) {
      throw new Error('Todos os campos são obrigatórios');
    }

    // Criar cliente no ASAAS
    const customerResponse = await fetch(`${asaasApiUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      },
      body: JSON.stringify({
        name: razaoSocial,
        cpfCnpj: cnpj.replace(/\D/g, ''),
        email
      })
    });

    if (!customerResponse.ok) {
      const error = await customerResponse.json();
      throw new Error(`Erro ao criar cliente: ${error.errors?.[0]?.description || 'Erro desconhecido'}`);
    }

    const customer = await customerResponse.json();

    // Criar cobrança no ASAAS
    const paymentResponse = await fetch(`${asaasApiUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      },
      body: JSON.stringify({
        customer: customer.id,
        billingType: 'CREDIT_CARD',
        value: employeeCount * 10,
        dueDate: new Date().toISOString().split('T')[0],
        description: `Avaliação HSE-IT - ${employeeCount} funcionários`,
        externalReference: companyId
      })
    });

    if (!paymentResponse.ok) {
      const error = await paymentResponse.json();
      throw new Error(`Erro ao criar cobrança: ${error.errors?.[0]?.description || 'Erro desconhecido'}`);
    }

    const payment = await paymentResponse.json();

    // Atualizar assinatura com ID do ASAAS
    const { error: updateError } = await supabase
      .from('assinatura_empresa')
      .update({ asaas_id: payment.id })
      .eq('empresa_id', companyId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true,
        paymentId: payment.id,
        paymentUrl: payment.invoiceUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});