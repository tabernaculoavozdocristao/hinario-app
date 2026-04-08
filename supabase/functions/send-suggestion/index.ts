import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SuggestionPayload {
  type: 'ausente' | 'correcao';
  name: string;
  email: string;
  hymnNumber: string;
  hymnTitle: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: SuggestionPayload = await req.json();

    const { type, name, email, hymnNumber, hymnTitle, message } = payload;

    if (!hymnTitle || !hymnTitle.trim()) {
      return new Response(
        JSON.stringify({ error: 'Título do hino é obrigatório' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!message || !message.trim()) {
      return new Response(
        JSON.stringify({ error: 'Mensagem é obrigatória' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('RESEND_API_KEY exists:', !!resendApiKey);
    console.log('RESEND_API_KEY length:', resendApiKey?.length || 0);
    console.log('RESEND_API_KEY prefix:', resendApiKey?.substring(0, 6) || 'N/A');

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found in environment variables');
      console.error('Available env vars:', Object.keys(Deno.env.toObject()).join(', '));
      return new Response(
        JSON.stringify({ error: 'Serviço de e-mail não configurado' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!resendApiKey.startsWith('re_')) {
      console.error('RESEND_API_KEY does not start with re_ - may be invalid');
    }

    const typeLabel = type === 'ausente' ? 'Informar um hino ausente' : 'Corrigir um hino existente';
    const subject = type === 'ausente' ? '[Sugestão de Hino] Hino Ausente' : '[Correção de Hino] Correção Necessária';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
          ${type === 'ausente' ? 'Sugestão de Hino Ausente' : 'Correção de Hino'}
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Tipo:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${typeLabel}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Nome:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name || 'Não informado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">E-mail:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${email || 'Não informado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Número do hino:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${hymnNumber || 'Não informado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Título do hino:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${hymnTitle}</td>
          </tr>
        </table>

        <div style="margin-top: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Mensagem:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">
            ${message}
          </div>
        </div>

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
        <p style="color: #888; font-size: 12px; margin-top: 10px;">
          Enviado através do Hinário Digital
        </p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Hinário Digital <onboarding@resend.dev>',
        to: ['abner-gomes1@hotmail.com'],
        subject: subject,
        html: htmlBody,
        reply_to: email || undefined,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, errorData);

      let errorMessage = 'Falha ao enviar e-mail';
      try {
        const parsedError = JSON.parse(errorData);
        if (parsedError.message) {
          errorMessage = `Erro Resend: ${parsedError.message}`;
        }
      } catch {
        errorMessage = `Erro Resend (${resendResponse.status}): ${errorData}`;
      }

      return new Response(
        JSON.stringify({ error: errorMessage, details: errorData }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
