export async function onRequest(context) {
  // 2. Bu Cloudflare Pages Function yalnızca POST isteklerini kabul etsin.
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST'
      }
    });
  }

  try {
    // 3. Gelen form verisinden şu alanları okusun: email, company_website
    let body;
    try {
      body = await context.request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { email, company_website } = body || {};

    // 4. company_website alanı doluysa bunun bot gönderimi olduğunu kabul et ve Brevo'ya istek göndermeden başarılı görünümlü bir JSON yanıtı döndür.
    if (company_website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. E-posta adresini sunucu tarafında doğrula:
    // - Boşsa 400 durum kodu döndür.
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // - E-postayı trim et ve küçük harfe dönüştür.
    const trimmedEmail = email.trim().toLowerCase();

    // - Geçerli bir e-posta formatında değilse 400 durum kodu döndür.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Retrieve environment variables
    const apiKey = context.env.BREVO_API_KEY;
    const listIdRaw = context.env.BREVO_LIST_ID;

    if (!apiKey || !listIdRaw) {
      console.error("Brevo API integration error: BREVO_API_KEY or BREVO_LIST_ID environment variable is missing.");
      return new Response(JSON.stringify({ error: 'Internal server configuration error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const listId = Number(listIdRaw);
    if (isNaN(listId)) {
      console.error("Brevo API integration error: BREVO_LIST_ID is not a valid number.");
      return new Response(JSON.stringify({ error: 'Internal server configuration error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 6. Brevo API'ye POST isteği gönder
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        email: trimmedEmail,
        listIds: [listId],
        updateEnabled: true
      })
    });

    if (brevoResponse.ok) {
      // 7. Brevo başarılı yanıt verdiğinde JSON olarak şunu döndür: { "success": true }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // 8. Brevo hata verdiğinde:
      // - API anahtarını veya hassas verileri cevaba yazma.
      // - Sunucu konsoluna yalnızca güvenli hata bilgisi yaz.
      // - Kullanıcıya 502 durum koduyla genel bir JSON hata mesajı döndür.
      const errorText = await brevoResponse.text();
      console.error(`Brevo API error: Status ${brevoResponse.status} - ${errorText.substring(0, 500)}`);
      return new Response(JSON.stringify({ error: 'Subscription failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err) {
    console.error(`Brevo API integration unexpected error: ${err.message}`);
    return new Response(JSON.stringify({ error: 'Subscription failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
