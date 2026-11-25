/* Fixnote satın alma sayfası (satin-al.html / buy.html).
   Lisans seçimi, sipariş özeti, ön bilgilendirme onayı ve ödeme düğmesi. */
(function () {
  'use strict';

  // ÖDEME LİNKLERİ: tek yer. iyzico panelinde (iyzico Link) her lisans için oluşturulan
  // ödeme bağlantısı buraya yazılır. Boş bırakılan lisans WhatsApp siparişine düşer.
  // Yalnızca https://iyzi.link/... ya da iyzico.com / iyzipay.com adresleri kabul edilir.
  const ODEME_LINKLERI = {
    aylik: "",
    yillik: "",
    suresiz: ""
  };

  const WA_NO = "905369011714";

  // FİYATLAR: fixnote.html / fixnote-en.html fiyat kartlarıyla aynı tutulmalı (KDV dahil, TL).
  const LISANSLAR = {
    aylik: {
      tr: { ad: "Aylık lisans", fiyat: "499 TL", birim: "/ ay", donem: "Aylık; bedel her ayın başında peşin alınır", iptal: "İstediğin zaman iptal edebilirsin; iptal ödenmiş dönemin sonunda geçerli olur." },
      en: { ad: "Monthly licence", fiyat: "499 TL", birim: "/ month", donem: "Monthly; paid in advance at the start of each month", iptal: "Cancel any time; cancellation takes effect at the end of the paid period." }
    },
    yillik: {
      tr: { ad: "Yıllık lisans", fiyat: "4.790 TL", birim: "/ yıl", donem: "Yıllık; bedel yılın başında peşin alınır", iptal: "İstediğin zaman iptal edebilirsin; iptal ödenmiş dönemin sonunda geçerli olur." },
      en: { ad: "Yearly licence", fiyat: "4,790 TL", birim: "/ year", donem: "Yearly; paid in advance at the start of the year", iptal: "Cancel any time; cancellation takes effect at the end of the paid period." }
    },
    suresiz: {
      tr: { ad: "Süresiz lisans", fiyat: "8.990 TL", birim: "tek seferlik", donem: "Tek seferlik ödeme; abonelik değildir, yenileme yoktur", iptal: "Abonelik olmadığı için iptal gerekmez. İlk yıl güncellemeler ve destek dahil; sonrası isteğe bağlı yılda 690 TL." },
      en: { ad: "Lifetime licence", fiyat: "8,990 TL", birim: "one-off", donem: "One-off payment; not a subscription, no renewals", iptal: "Not a subscription, so nothing to cancel. Updates and support included for the first year; after that optional at 690 TL a year." }
    }
  };

  const dil = (document.documentElement.lang || 'tr').slice(0, 2) === 'en' ? 'en' : 'tr';
  const METIN = {
    tr: {
      odeIyzico: "iyzico ile öde",
      odeWa: "WhatsApp'tan sipariş ver",
      notIyzico: "iyzico'nun güvenli ödeme sayfası açılır. Ödeme ekranında girdiğin iletişim bilgilerine lisans bilgilerin gönderilir.",
      notWa: "Siparişini WhatsApp'tan onaylarız; ödeme bilgileri sana oradan iletilir.",
      onayUyari: "Devam etmek için yukarıdaki onay kutusunu işaretle.",
      waMesaj: function (l) { return "Merhaba, Fixnote " + l.ad + " (" + l.fiyat + (l.birim === "tek seferlik" ? "" : " " + l.birim) + ", KDV dahil) satın almak istiyorum. Ön Bilgilendirme Formu'nu ve Mesafeli Satış Sözleşmesi'ni okudum, onaylıyorum."; }
    },
    en: {
      odeIyzico: "Pay with iyzico",
      odeWa: "Order on WhatsApp",
      notIyzico: "The iyzico secure payment page opens. Your licence details are sent to the contact details you enter there.",
      notWa: "We confirm your order on WhatsApp and send you the payment details there.",
      onayUyari: "Tick the box above to continue.",
      waMesaj: function (l) { return "Hello, I'd like to buy the Fixnote " + l.ad.toLowerCase() + " (" + l.fiyat + (l.birim === "one-off" ? "" : " " + l.birim) + ", VAT included). I have read and accept the Pre-Information Form and the Distance Sales Agreement."; }
    }
  }[dil];

  function gecerliLink(u) {
    if (!u) return false;
    try {
      const x = new URL(u);
      return x.protocol === 'https:' && /(^|\.)(iyzi\.link|iyzico\.com|iyzipay\.com)$/i.test(x.hostname);
    } catch (e) { return false; }
  }

  function seciliOku() {
    let p = '';
    try { p = new URLSearchParams(location.search).get('lisans') || ''; } catch (e) {}
    return Object.prototype.hasOwnProperty.call(LISANSLAR, p) ? p : 'yillik';
  }

  const radyolar = Array.prototype.slice.call(document.querySelectorAll('input[name="lisans"]'));
  const onay = document.getElementById('onay');
  const btn = document.getElementById('ode-btn');
  const btnYazi = document.getElementById('ode-btn-yazi');
  const not = document.getElementById('ode-not');
  const uyari = document.getElementById('ode-uyari');
  if (!radyolar.length || !onay || !btn) return;

  let secili = seciliOku();

  function yaz(sel, deger) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) { el.textContent = deger; });
  }

  function guncelle() {
    const l = LISANSLAR[secili][dil];
    const link = ODEME_LINKLERI[secili];
    const iyzicoVar = gecerliLink(link);
    if (link && !iyzicoVar) console.warn('[satin-al] Geçersiz ödeme linki, WhatsApp kullanılıyor:', secili);

    radyolar.forEach(function (r) {
      r.checked = r.value === secili;
      const kart = r.closest('.lisans-kart');
      if (kart) kart.classList.toggle('secili', r.checked);
    });
    Object.keys(LISANSLAR).forEach(function (k) {
      yaz('[data-kart-fiyat="' + k + '"]', LISANSLAR[k][dil].fiyat);
    });
    yaz('[data-ozet="ad"]', 'Fixnote · ' + l.ad);
    yaz('[data-ozet="fiyat"]', l.fiyat + ' ' + l.birim);
    yaz('[data-ozet="toplam"]', l.fiyat);
    yaz('[data-ozet="donem"]', l.donem);
    yaz('[data-ozet="iptal"]', l.iptal);

    const hedef = iyzicoVar ? link : 'https://wa.me/' + WA_NO + '?text=' + encodeURIComponent(METIN.waMesaj(l));
    btnYazi.textContent = (iyzicoVar ? METIN.odeIyzico : METIN.odeWa) + ' · ' + l.fiyat;
    if (not) not.textContent = iyzicoVar ? METIN.notIyzico : METIN.notWa;
    btn.setAttribute('data-hedef', hedef);
    if (iyzicoVar) { btn.removeAttribute('target'); btn.removeAttribute('rel'); }
    else { btn.setAttribute('target', '_blank'); btn.setAttribute('rel', 'noopener'); }

    if (onay.checked) {
      btn.href = hedef;
      btn.removeAttribute('aria-disabled');
      if (uyari) uyari.hidden = true;
    } else {
      btn.setAttribute('href', '#onay');
      btn.setAttribute('aria-disabled', 'true');
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-dil-link]'), function (a) {
      a.href = a.getAttribute('data-dil-link') + '?lisans=' + secili;
    });
  }

  radyolar.forEach(function (r) {
    r.addEventListener('change', function () {
      if (!r.checked) return;
      secili = r.value;
      try { history.replaceState(null, '', location.pathname + '?lisans=' + secili); } catch (e) {}
      guncelle();
    });
  });
  onay.addEventListener('change', guncelle);
  btn.addEventListener('click', function (e) {
    if (!onay.checked) {
      e.preventDefault();
      if (uyari) { uyari.textContent = METIN.onayUyari; uyari.hidden = false; }
      onay.focus();
    }
  });

  guncelle();
})();
