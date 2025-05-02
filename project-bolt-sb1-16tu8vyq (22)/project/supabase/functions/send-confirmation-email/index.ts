import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info',
};

// Validação de variáveis de ambiente
const validateEnv = () => {
  const required = {
    SUPABASE_URL: Deno.env.get('SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    RESEND_API_KEY: Deno.env.get('RESEND_API_KEY'),
  };

  console.log('Environment variables:', {
    SUPABASE_URL: !!required.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!required.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!required.RESEND_API_KEY,
  });

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return required;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Iniciando processamento da requisição');
    const env = validateEnv();
    const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

    const body = await req.json().catch(() => {
      throw new Error('Invalid JSON in request body');
    });

    console.log('Request body:', body);

    const { companyId, email, razaoSocial } = body;

    if (!companyId || !email || !razaoSocial) {
      throw new Error('Missing required fields: companyId, email, and razaoSocial are required');
    }

    const confirmationToken = crypto.randomUUID();
    const now = new Date().toISOString();

    console.log('Atualizando empresa no Supabase...');
    const { error: updateError } = await supabase
      .from('empresas')
      .update({
        confirmation_token: confirmationToken,
        confirmation_sent_at: now,
        status: 'PENDENTE_CONFIRMACAO',
      })
      .eq('id', companyId);

    if (updateError) {
      throw new Error(`Erro ao atualizar empresa: ${updateError.message}`);
    }

    const confirmationUrl = `${Deno.env.get('PUBLIC_SITE_URL') || 'https://rad-cendol-746b39.netlify.app'}/confirmar-cadastro?token=${confirmationToken}`;
    console.log('URL de confirmação:', confirmationUrl);

    console.log('Enviando email via Resend...');
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'nao-responda@avaliacaoriscopsicossocial.com.br',
        to: email,
        subject: 'Confirme seu cadastro - Avaliação de Risco Psicossocial',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a56db;">Olá, ${razaoSocial}!</h1>
            <p style="font-size: 16px; line-height: 1.5;">Obrigado por se cadastrar em nosso sistema de Avaliação de Risco Psicossocial.</p>
            <p style="font-size: 16px; line-height: 1.5;">Para confirmar seu cadastro e começar a usar nosso sistema, clique no botão abaixo:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Confirmar Cadastro
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
            <p style="font-size: 14px; color: #666; word-break: break-all;">${confirmationUrl}</p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">Este link expira em 24 horas.</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Erro Resend:', errorData);
      throw new Error(`Falha ao enviar e-mail: ${errorData.message || 'Erro desconhecido'}`);
    }

    const emailData = await emailResponse.json();
    console.log('Email enviado com sucesso:', emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email de confirmação enviado com sucesso!',
        emailId: emailData.id 
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    return new Response(
      JSON.stringify({ 
        error: err instanceof Error ? err.message : 'Erro desconhecido',
        details: err instanceof Error ? err.stack : undefined
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});