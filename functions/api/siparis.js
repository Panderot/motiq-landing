// Sipariş formu (siparis.html) -> Brevo transactional e-posta -> info@motiqai.com
// Bülten formuyla aynı Brevo hesabını ve BREVO_API_KEY ortam değişkenini kullanır.
// İsteğe bağlı ortam değişkenleri:
//   ORDER_TO_EMAIL   siparişin gideceği adres (varsayılan info@motiqai.com)
//   ORDER_FROM_EMAIL Brevo'da doğrulanmış gönderici adresi (varsayılan info@motiqai.com)
import { PAKETLER, tl } from '../../assets/paketler.js';

const ONAY_METINLERI = {
  abonelik: {
    on_bilgilendirme: "Ön Bilgilendirme Formu'nu okudum.",
    mesafeli_sozlesme: "Mesafeli Satış Sözleşmesi'ni okudum ve kabul ediyorum.",
    hemen_baslama: 'Hizmetin ödemeden hemen sonra başlamasını onaylıyorum; bu nedenle cayma hakkımın olmadığını biliyorum.',
  },
  proje: {
    genel_hizmet_sartlari: "Genel Hizmet Şartları'nı okudum ve kabul ediyorum.",
    isletme_alimi: 'Bu hizmeti işletmem adına ya da serbest çalışan olarak işim için satın alıyorum.',
  },
};

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max) : '');

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return json(400, { error: 'Invalid request body' });
  }
  body = body || {};

  // Bot tuzağı: gizli alan doluysa e-posta göndermeden başarılı görün.
  if (body.company_website) return json(200, { success: true });

  const key = typeof body.paket === 'string' ? body.paket : '';
  const paket = Object.prototype.hasOwnProperty.call(PAKETLER, key) ? PAKETLER[key] : null;
  if (!paket) return json(400, { error: 'Invalid package' });

  const ad = clean(body.ad, 120);
  const email = clean(body.email, 254).toLowerCase();
  const telefon = clean(body.telefon, 40);
  const not = clean(body.not, 2000);

  if (!ad) return json(400, { error: 'Name is required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'Invalid email format' });
  if (!/^[0-9+()\s.-]{7,40}$/.test(telefon)) return json(400, { error: 'Invalid phone' });

  // Paket türüne göre zorunlu onayların hepsi işaretlenmiş olmalı.
  const gerekli = ONAY_METINLERI[paket.tur];
  const onaylar = body.onaylar && typeof body.onaylar === 'object' ? body.onaylar : {};
  if (!Object.keys(gerekli).every(k => onaylar[k] === true)) {
    return json(400, { error: 'Required confirmations missing' });
  }

  const apiKey = context.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('Order form error: BREVO_API_KEY environment variable is missing.');
    return json(502, { error: 'Internal server configuration error' });
  }
  const to = context.env.ORDER_TO_EMAIL || 'info@motiqai.com';
  const from = context.env.ORDER_FROM_EMAIL || 'info@motiqai.com';

  const tutar = paket.donem ? `${tl(paket.fiyat)} / ${paket.donem}` : `${tl(paket.fiyat)} (tek seferlik)`;
  const zaman = new Date();
  const zamanTr = zaman.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', dateStyle: 'long', timeStyle: 'medium' });
  const onaySatirlari = Object.entries(gerekli).map(([k, metin]) => `[x] ${metin}`);

  const satirlar = [
    ['Paket', `${paket.ad} (${key})`],
    ['Tutar', `${tutar}, KDV dahil`],
    ['Tür', paket.tur === 'abonelik' ? 'Abonelik' : 'Proje paketi (işletme / serbest çalışan)'],
    ['Ad soyad / firma', ad],
    ['E-posta', email],
    ['Telefon', telefon],
    ['Not', not || '-'],
    ['Tarih', `${zamanTr} (${zaman.toISOString()})`],
  ];

  const textContent = [
    'Siteden yeni sipariş geldi. Ödeme bağlantısını en geç 1 iş günü içinde müşteriye e-postayla gönder.',
    '',
    ...satirlar.map(([k, v]) => `${k}: ${v}`),
    '',
    'Formda verilen onaylar:',
    ...onaySatirlari,
  ].join('\n');

  const htmlContent = `<p>Siteden yeni sipariş geldi. Ödeme bağlantısını en geç 1 iş günü içinde müşteriye e-postayla gönder.</p>
<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
${satirlar.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top;"><b>${esc(k)}</b></td><td style="white-space:pre-wrap;">${esc(v)}</td></tr>`).join('\n')}
</table>
<p><b>Formda verilen onaylar:</b><br>${onaySatirlari.map(esc).join('<br>')}</p>`;

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        sender: { name: 'MotiqAI Sipariş', email: from },
        to: [{ email: to }],
        replyTo: { email, name: ad },
        subject: `Sipariş: ${paket.ad}`,
        textContent,
        htmlContent,
      }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Order form Brevo error: Status ${res.status} - ${errorText.substring(0, 500)}`);
      return json(502, { error: 'Order could not be sent' });
    }
    return json(200, { success: true });
  } catch (err) {
    console.error(`Order form unexpected error: ${err.message}`);
    return json(502, { error: 'Order could not be sent' });
  }
}
