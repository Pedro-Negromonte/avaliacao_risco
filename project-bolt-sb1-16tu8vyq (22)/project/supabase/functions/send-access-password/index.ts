import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function generatePassword() {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      throw new Error('Variáveis de ambiente não configuradas corretamente');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { companyId, email } = await req.json();

    if (!companyId || !email) {
      throw new Error('ID da empresa e email são obrigatórios');
    }

    const accessPassword = generatePassword();

    const { error: updateError } = await supabase
      .from('empresas')
      .update({ access_password: accessPassword })
      .eq('id', companyId);

    if (updateError) {
      throw new Error(`Erro ao atualizar empresa: ${updateError.message}`);
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'HSE Assessment <onboarding@resend.dev>',
        to: [email],
        subject: 'Acesso ao Sistema de Avaliação HSE-IT',
        html: `
          <h2>Bem-vindo ao Sistema de Avaliação HSE-IT</h2>
          <p>Sua senha de acesso foi gerada com sucesso.</p>
          <p><strong>Senha: ${accessPassword}</strong></p>
          <p>Use esta senha junto com o CNPJ da sua empresa para acessar o sistema.</p>
          <p>Guarde esta senha em um local seguro, pois ela será necessária também para finalizar o processo de avaliação.</p>
        `
      })
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Erro Resend:', emailData);
      throw new Error(emailData.message || 'Erro ao enviar email');
    }

    return new Response(
      JSON.stringify({ success: true, id: emailData.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro completo:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});