import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyId, email } = await req.json();

    if (!companyId || !email) {
      throw new Error('ID da empresa e email são obrigatórios');
    }

    // Gerar senha de acesso
    const accessPassword = generatePassword();

    // Atualizar a empresa com a senha
    const { error: updateError } = await supabase
      .from('empresas')
      .update({ access_password: accessPassword })
      .eq('id', companyId);

    if (updateError) throw updateError;

    // Enviar email usando o serviço de email do Supabase
    const { error: emailError } = await supabase.auth.admin.sendRawEmail({
      to: email,
      subject: 'Acesso ao Sistema de Avaliação HSE-IT',
      body: `
        <h2>Bem-vindo ao Sistema de Avaliação HSE-IT</h2>
        <p>Sua senha de acesso foi gerada com sucesso.</p>
        <p><strong>Senha: ${accessPassword}</strong></p>
        <p>Use esta senha junto com o CNPJ da sua empresa para acessar o sistema.</p>
        <p>Guarde esta senha em um local seguro, pois ela será necessária também para finalizar o processo de avaliação.</p>
      `,
      html: `
        <h2>Bem-vindo ao Sistema de Avaliação HSE-IT</h2>
        <p>Sua senha de acesso foi gerada com sucesso.</p>
        <p><strong>Senha: ${accessPassword}</strong></p>
        <p>Use esta senha junto com o CNPJ da sua empresa para acessar o sistema.</p>
        <p>Guarde esta senha em um local seguro, pois ela será necessária também para finalizar o processo de avaliação.</p>
      `
    });

    if (emailError) throw emailError;

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});