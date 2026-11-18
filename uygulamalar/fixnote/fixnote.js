/* Fixnote tanıtım sayfası davranışları (fixnote.html / fixnote-en.html).
   Fixnote ana sayfasındaki React bileşenlerinin (HeroMaket, SureHesap, OrnekRapor, SablonEditoru,
   MusteriGecmisi, WhatsAppBolum, IsDongu, Fiyat, GorununceOynat) vanilla JS karşılığı.
   Süreler, geçiş zamanları ve metinler Fixnote kaynağından birebir alınmıştır. */
(function () {
  'use strict';

  // Fiyatlar TEK yerde. Fixnote app/lib/paket.ts ile AYNI tutulmalı.
  const PAKET = { usta: { ay: 499, yil: 4790 }, firma: { ay: 1249, yil: 11990 } };
  const FIXNOTE = 'https://fixnotee.vercel.app';

  const kok = document.getElementById('fx');
  const dataEl = document.getElementById('fx-data');
  if (!kok || !dataEl) return;
  const VERI = JSON.parse(dataEl.textContent);
  const EN = document.documentElement.lang === 'en';
  const DIL = EN ? 'en' : 'tr';

  const $ = (s, c) => (c || kok).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || kok).querySelectorAll(s));
  const hareketsiz = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // para / tlSayi: Fixnote app/lib/servis.ts ve paket.ts ile aynı biçim
  function para(n, birim, dil, kurussuz) {
    const neg = n < 0;
    const p = Math.abs(n).toFixed(2).split('.');
    const grup = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, dil === 'en' ? ',' : '.');
    const sayi = kurussuz && p[1] === '00' ? grup : grup + (dil === 'en' ? '.' : ',') + p[1];
    const sembol = { TL: 'TL', USD: '$', EUR: '€', GBP: '£' }[birim] || birim;
    return (neg ? '-' : '') + (birim === 'TL' ? sayi + ' TL' : sembol + sayi);
  }
  function tlSayi(n, dil) {
    const k = Math.round(n * 100);
    const tam = String(Math.floor(k / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, dil === 'en' ? ',' : '.');
    const kurus = k % 100;
    return kurus ? tam + (dil === 'en' ? '.' : ',') + String(kurus).padStart(2, '0') : tam;
  }

  // Bir öğe ilk kez görününce çağrılır. Sayfa açılırken zaten ekrandaysa "ekranda" döner (animasyon yok, son hâl).
  function gorununce(el, esik, bos, oynat) {
    let ilk = true;
    const io = new IntersectionObserver(function (es) {
      const e = es[0];
      if (ilk) {
        ilk = false;
        if (e.isIntersecting) io.disconnect();
        else bos();
        return;
      }
      if (!e.isIntersecting) return;
      io.disconnect();
      oynat();
    }, { threshold: esik });
    io.observe(el);
    return io;
  }

  // ---------- GorununceOynat: bölüm görününce BİR KEZ oynar ----------
  function gorununceOynat() {
    if (hareketsiz()) return;
    $$('[data-gor]').forEach(function (el) {
      gorununce(el, 0.3, function () { el.setAttribute('data-gor', 'hayir'); }, function () { el.setAttribute('data-gor', 'evet'); });
    });
  }

  // ---------- HeroMaket: döngüde, görünürken ----------
  function hero() {
    const rootEl = $('[data-hm="root"]');
    if (!rootEl) return;
    const T = EN
      ? { pdf: 'PDF ready', gitti: 'Sent on WhatsApp', bekl: 'Waiting for signature' }
      : { pdf: 'PDF hazır', gitti: "WhatsApp'la gönderildi", bekl: 'İmza bekleniyor' };
    const CYCLE = 9800;
    const adimOf = (t) => (t >= 5300 ? 'panel' : t >= 4600 ? 'gonderildi' : t >= 3800 ? 'pdf' : t >= 2300 ? 'imza' : t >= 600 ? 'liste' : 'bos');
    const rowsOf = (t) => (t >= 1740 ? 4 : t >= 1360 ? 3 : t >= 980 ? 2 : t >= 600 ? 1 : 0);
    function derive(t) {
      let ciro = 0;
      if (t >= 5300) { const p = Math.min(1, (t - 5300) / 900); ciro = 1 - Math.pow(1 - p, 3); }
      return { adim: adimOf(t), rows: rowsOf(t), imzaOn: t >= 2300, toast: t >= 4600 && t < 5900, ciro: ciro };
    }
    const lbls = $$('.hm-lbl', rootEl), sws = $$('.hm-sw', rootEl), signs = $$('[data-hm="sign"]', rootEl), toasts = $$('[data-hm="toast"]', rootEl);
    const btns = $$('[data-hm="btn"]', rootEl), adets = $$('[data-hm="adet"]', rootEl), bars = $$('[data-hm="bar"]', rootEl);
    const ciros = $$('[data-hm="ciro"]', rootEl), newrows = $$('[data-hm="newrow"]', rootEl);
    const son = {};
    const ayarla = (anahtar, deger, f) => { if (son[anahtar] !== deger) { son[anahtar] = deger; f(); } };

    function goster(s) {
      ayarla('adim', s.adim, function () {
        rootEl.setAttribute('data-adim', s.adim);
        const panel = s.adim === 'panel', gitti = s.adim === 'gonderildi' || panel;
        adets.forEach(function (e) { e.textContent = String(+e.getAttribute('data-n') + (panel ? 1 : 0)); e.classList.toggle('on', panel); });
        bars.forEach(function (e) { e.style.height = (panel ? e.getAttribute('data-h1') : e.getAttribute('data-h0')) + 'px'; });
        newrows.forEach(function (e) { e.classList.toggle('on', panel); });
        btns.forEach(function (b) {
          b.setAttribute('data-st', s.adim === 'pdf' ? 'pdf' : gitti ? 'sent' : 'bos');
          $('[data-hm="btn-t"]', b).textContent = s.adim === 'pdf' ? T.pdf : gitti ? T.gitti : T.bekl;
        });
      });
      ayarla('rows', s.rows, function () {
        lbls.forEach(function (e, k) { e.classList.toggle('on', (k % 4) < s.rows); });
        sws.forEach(function (e, k) { e.classList.toggle('on', (k % 4) < s.rows); });
      });
      ayarla('imza', s.imzaOn, function () { signs.forEach(function (e) { e.classList.toggle('on', s.imzaOn); }); });
      ayarla('toast', s.toast, function () { toasts.forEach(function (e) { e.classList.toggle('on', s.toast); }); });
      ayarla('ciro', Math.round(s.ciro * 1000), function () {
        ciros.forEach(function (e) {
          e.textContent = para(Math.round(+e.getAttribute('data-base') + +e.getAttribute('data-add') * s.ciro), e.getAttribute('data-unit'), DIL);
        });
      });
    }

    if (hareketsiz()) { goster({ adim: 'panel', rows: 4, imzaOn: true, toast: false, ciro: 1 }); return; }
    let raf = 0, last = null, elapsed = 0, gorunur = document.visibilityState === 'visible', ekranda = false;
    function kare(now) {
      if (last == null) last = now;
      elapsed += now - last; last = now;
      if (elapsed >= CYCLE) elapsed = 0;
      goster(derive(elapsed));
      raf = requestAnimationFrame(kare);
    }
    const basla = () => { if (raf || !gorunur || !ekranda) return; last = null; raf = requestAnimationFrame(kare); };
    const dur = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } last = null; };
    new IntersectionObserver(function (es) { ekranda = es[0].isIntersecting; if (ekranda) basla(); else dur(); }, { threshold: 0.15 }).observe(rootEl);
    document.addEventListener('visibilitychange', function () { gorunur = document.visibilityState === 'visible'; if (gorunur) basla(); else dur(); });
  }

  // ---------- SureHesap: kaydırıcılar, akan sayılar, görününce otomatik demo ----------
  function sureHesap() {
    const kart = $('[data-sh="root"]');
    if (!kart) return;
    const YENI_DK = 2;
    const adetEl = $('[data-sh="adet"]'), dkEl = $('[data-sh="dk"]'), bugunEl = $('[data-sh="bugun"]'), yeniEl = $('[data-sh="yeni"]');
    const kazEl = $('[data-sh="kazanc"]'), gunEl = $('[data-sh="gun"]'), okEl = $('[data-sh="ok"]'), fxEl = $('[data-sh="fx"]');
    const adetIn = $('#h-adet'), dkIn = $('#h-dk');
    let adet = 60, dk = 15, durum = 'statik', demo = 0, raf = 0, sonKazanc = 0, vurguT = 0;
    const hedef = function () {
      const bugun = (adet * dk) / 60, yeni = (adet * YENI_DK) / 60, kazanc = Math.max(0, bugun - yeni);
      return { bugun: bugun, yeni: yeni, kazanc: kazanc, gun: Math.round((kazanc * 12) / 8) };
    };
    let simdi = hedef();
    sonKazanc = simdi.kazanc;
    const s = (n) => (n >= 10 ? Math.round(n).toString() : EN ? n.toFixed(1) : n.toFixed(1).replace('.', ','));
    function boya(g) {
      adetEl.textContent = adet;
      dkEl.textContent = dk + (EN ? ' min' : ' dk');
      adetIn.value = adet; dkIn.value = dk;
      bugunEl.textContent = s(g.bugun) + (EN ? ' h' : ' sa');
      yeniEl.textContent = s(g.yeni) + (EN ? ' h' : ' sa');
      kazEl.textContent = s(g.kazanc) + (EN ? ' hours' : ' saat');
      gunEl.textContent = EN ? '≈ ' + Math.round(g.gun) + ' working days a year' : 'yılda ≈ ' + Math.round(g.gun) + ' iş günü';
    }
    function vurgula() {
      clearTimeout(vurguT);
      kazEl.classList.add('pop'); fxEl.classList.add('pop'); okEl.classList.add('nd');
      vurguT = setTimeout(function () { kazEl.classList.remove('pop'); fxEl.classList.remove('pop'); okEl.classList.remove('nd'); }, 260);
    }
    function vurguKontrol() {
      if (durum === 'oynuyor' || durum === 'bekliyor') return;
      const k = hedef().kazanc;
      if (Math.abs(k - sonKazanc) < 0.5) return;
      sonKazanc = k;
      if (hareketsiz()) return;
      vurgula();
    }
    function guncelle() {
      const h = hedef();
      cancelAnimationFrame(raf);
      const akici = durum === 'statik' || durum === 'bitti';
      if (!akici || hareketsiz()) { simdi = h; boya(h); }
      else {
        const bas = simdi, t0 = performance.now();
        const adim = function (t) {
          const p = Math.min(1, (t - t0) / 350), e = 1 - Math.pow(1 - p, 3);
          simdi = { bugun: bas.bugun + (h.bugun - bas.bugun) * e, yeni: bas.yeni + (h.yeni - bas.yeni) * e, kazanc: bas.kazanc + (h.kazanc - bas.kazanc) * e, gun: bas.gun + (h.gun - bas.gun) * e };
          boya(simdi);
          if (p < 1) raf = requestAnimationFrame(adim);
        };
        adetEl.textContent = adet; dkEl.textContent = dk + (EN ? ' min' : ' dk');
        raf = requestAnimationFrame(adim);
      }
      vurguKontrol();
    }
    const elle = function () { demo++; if (durum !== 'statik') durum = 'bitti'; };
    [adetIn, dkIn].forEach(function (inp) {
      inp.addEventListener('pointerdown', elle);
      inp.addEventListener('keydown', elle);
    });
    adetIn.addEventListener('input', function () { elle(); adet = +adetIn.value; guncelle(); });
    dkIn.addEventListener('input', function () { elle(); dk = +dkIn.value; guncelle(); });

    if (hareketsiz()) return;
    function kay(bas, son, ms, adimBoy, yaz, kimlik) {
      return new Promise(function (coz) {
        const t0 = performance.now();
        const f = function (t) {
          if (demo !== kimlik) return coz(false);
          const p = Math.min(1, (t - t0) / ms), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          yaz(Math.round((bas + (son - bas) * e) / adimBoy) * adimBoy);
          if (p < 1) requestAnimationFrame(f); else coz(true);
        };
        requestAnimationFrame(f);
      });
    }
    async function oynat() {
      const kimlik = ++demo;
      durum = 'oynuyor';
      await bekle(300);
      if (!(await kay(10, 60, 1100, 5, function (n) { adet = n; guncelle(); }, kimlik))) return;
      await bekle(150);
      if (!(await kay(5, 15, 900, 1, function (n) { dk = n; guncelle(); }, kimlik))) return;
      if (demo !== kimlik) return;
      durum = 'bitti';
      guncelle();
      vurgula();
    }
    gorununce(kart, 0.4, function () { adet = 10; dk = 5; durum = 'bekliyor'; guncelle(); }, oynat);
  }

  // ---------- OrnekRapor: iş sekmeleri, A4 önizleme, 5,5 sn'lik tur, imza işaretçisi ----------
  function ornekRapor() {
    const rk = $('[data-or="root"]');
    if (!rk) return;
    const E = VERI.etiket;
    const NO = ['SR-2026-0048', 'SR-2026-0047', 'SR-2026-0046', 'SR-2026-0045', 'SR-2026-0044', 'SR-2026-0042'];
    const ETIKET = EN
      ? [[E.parcaIscilik, 'Parts, VAT and next service'], [E.fotolar, 'Before / after photos'], [E.liste, 'Skipped step crossed out'], [E.parcaIscilik, 'Parts by metre and quantity'], [E.parcaIscilik, 'Next visit date'], [E.parcaIscilik, 'No charge']]
      : [[E.parcaIscilik, 'Parça, KDV ve sonraki bakım'], [E.fotolar, 'Önce / sonra fotoğraflar'], [E.liste, 'Yapılmayan madde çizili'], [E.parcaIscilik, 'Metre ve adetle parçalar'], [E.parcaIscilik, 'Sonraki kontrol tarihi'], [E.parcaIscilik, 'Ücret yansıtılmaz']];
    const IMZA = { hedef: E.onay, etiket: EN ? 'Customer signature' : 'Müşteri imzası' };
    const TUR_MS = 5500;
    const tabs = $$('[data-or="tab"]', rk), hdr = $('[data-or="hdr"]', rk), win = $('[data-or="win"]', rk), slide = $('[data-or="slide"]', rk), imzaBtn = $('[data-or="imza"]', rk);
    const st = { i: 0, spot: null, tur: 'acik', gorunur: false, gecis: false };
    let basiliI = 0, basiliSpot = '', kutu = null, tourT = 0, ilkT = 0, halo = null;

    const spotObj = () => (st.spot === null ? null : st.spot === 'imza' ? IMZA : { hedef: ETIKET[st.spot][0], etiket: ETIKET[st.spot][1] });

    // A4 sayfayı kapsayıcıya sığdırır (Olcekli)
    function olcekle() {
      const wrap = $('.a4-wrap', slide), sc = $('.a4-scale', slide);
      if (!wrap || !sc) return;
      const s = Math.min(0.8, wrap.clientWidth / 794);
      sc.style.transform = 'scale(' + s + ')';
      wrap.style.height = sc.offsetHeight * s + 'px';
    }
    function olc() {
      const sp = spotObj();
      if (!sp) { kutu = null; yerles(); return; }
      const baslik = $$('.a4 h4', slide).find(function (e) { return e.textContent.trim() === sp.hedef; });
      const blok = baslik && baslik.parentElement;
      if (!blok) { kutu = null; yerles(); return; }
      const kb = slide.getBoundingClientRect(), bb = blok.getBoundingClientRect();
      const top = bb.top - kb.top, left = bb.left - kb.left;
      const ist = bb.height + 100 > win.clientHeight ? top - 40 : top + bb.height + 60 - win.clientHeight;
      const y = Math.max(0, Math.min(slide.offsetHeight - win.clientHeight, ist));
      kutu = { y: y, top: top, left: left, w: bb.width, h: bb.height };
      yerles();
    }
    function yerles() {
      slide.style.transform = 'translateY(' + -(kutu ? kutu.y : 0) + 'px)';
      if (halo && kutu) {
        halo.style.top = kutu.top - 6 + 'px'; halo.style.left = kutu.left - 8 + 'px';
        halo.style.width = kutu.w + 16 + 'px'; halo.style.height = kutu.h + 12 + 'px';
      }
    }
    function haloYap() {
      if (halo) { halo.remove(); halo = null; }
      const sp = spotObj();
      if (!sp) return;
      halo = document.createElement('div');
      halo.className = 'or-halka';
      halo.setAttribute('aria-hidden', 'true');
      halo.innerHTML = '<span class="or-etiket">' + esc(sp.etiket) + '</span>';
      slide.appendChild(halo);
    }
    function ilerleme() {
      $$('.or-ilerleme', rk).forEach(function (e) { e.remove(); });
      if (st.tur === 'acik' && st.gorunur && st.spot !== null) {
        const sp = document.createElement('span');
        sp.className = 'or-ilerleme'; sp.style.setProperty('--sure', TUR_MS + 'ms'); sp.setAttribute('aria-hidden', 'true');
        tabs[st.i].appendChild(sp);
      }
    }
    function boya() {
      tabs.forEach(function (t, j) { t.setAttribute('aria-pressed', String(j === st.i)); });
      rk.setAttribute('data-ornek', st.i); rk.setAttribute('data-tur', st.tur);
      const sp = spotObj();
      rk.setAttribute('data-spot', sp ? sp.hedef : '');
      slide.style.opacity = st.gecis ? '0' : '1';
      let degisti = false;
      if (basiliI !== st.i) {
        basiliI = st.i;
        const r = VERI.raporlar[NO[st.i]];
        $('.a4-scale', slide).innerHTML = r.html;
        hdr.lastChild.nodeValue = NO[st.i] + ' · ' + r.musteri;
        degisti = true;
      }
      const sk = st.spot === null ? '' : String(st.spot);
      if (sk !== basiliSpot) { basiliSpot = sk; haloYap(); degisti = true; }
      if (degisti) { olcekle(); setTimeout(function () { olcekle(); olc(); }, 60); }
      ilerleme();
      kur();
    }
    // zamanlayıcılar: ilk vurgu (1,2 sn) ve otomatik tur
    function kur() {
      clearTimeout(tourT); clearTimeout(ilkT);
      if (hareketsiz()) return;
      if (st.gorunur && st.spot === null) ilkT = setTimeout(function () { st.spot = 0; boya(); }, 1200);
      if (st.tur === 'acik' && st.gorunur && st.spot !== null) {
        if (st.i === NO.length - 1) { st.tur = 'bitti'; boya(); return; }
        tourT = setTimeout(function () { sec(st.i + 1, false); }, TUR_MS);
      }
    }
    function sec(j, elle) {
      if (elle) st.tur = 'durdu';
      if (j === st.i || hareketsiz()) { st.i = j; st.spot = j; boya(); return; }
      st.gecis = true; boya();
      setTimeout(function () { st.i = j; st.spot = j; st.gecis = false; boya(); }, 180);
    }
    tabs.forEach(function (t, j) { t.addEventListener('click', function () { sec(j, true); }); });
    imzaBtn.addEventListener('click', function () { st.tur = 'durdu'; st.spot = 'imza'; boya(); });
    win.addEventListener('pointerdown', function () { st.tur = 'durdu'; boya(); });

    const ro = new ResizeObserver(function () { olcekle(); olc(); });
    ro.observe(slide);
    const dis = $('.a4-wrap', slide); if (dis) ro.observe(dis);
    olcekle();

    let ekranda = false;
    const gunc = function () { st.gorunur = ekranda && document.visibilityState === 'visible'; boya(); };
    new IntersectionObserver(function (es) { ekranda = es[0].isIntersecting; gunc(); }, { threshold: 0.35 }).observe(rk);
    document.addEventListener('visibilitychange', gunc);
  }

  // ---------- IsDongu: dönen iş adları ----------
  function isDongu() {
    const el = $('[data-isler]');
    if (!el || hareketsiz()) return;
    const ISLER = JSON.parse(el.getAttribute('data-isler'));
    let i = 0;
    setInterval(function () {
      i = (i + 1) % ISLER.length;
      el.textContent = ISLER[i];
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    }, 2200);
  }

  // ---------- SablonEditoru: yazılan metin + imleç ----------
  function sablon() {
    const rk = $('[data-se="root"]');
    if (!rk) return;
    const SABLONLAR = VERI.sablonlar;
    const metin = (e) => e.textContent;
    const OZEL = { ad: metin($('[data-se="ad"]', rk)), tur: metin($('[data-se="tur"]', rk)), maddeler: $$('[data-se="rt"]', rk).map(metin) };
    const ADIM = [];
    for (let k = 0; k < OZEL.ad.length; k++) ADIM.push({ t: 'ad', ms: k === 0 ? 300 : 32 });
    for (let k = 0; k < OZEL.tur.length; k++) ADIM.push({ t: 'tur', ms: 40 });
    OZEL.maddeler.forEach(function (m) {
      ADIM.push({ t: 'ekle', ms: 180 });
      for (let k = 0; k < m.length; k++) ADIM.push({ t: 'harf', ms: 24 });
      ADIM.push({ t: 'ac', ms: 220 });
    });
    ADIM.push({ t: 'kaydet', ms: 350 });
    const SON = ADIM.length;
    function durumu(n) {
      let ad = 0, tur = 0, satir = 0, acik = 0, kayit = false;
      const harf = [0, 0, 0, 0];
      for (let k = 0; k < Math.min(n, SON); k++) {
        const t = ADIM[k].t;
        if (t === 'ad') ad++; else if (t === 'tur') tur++; else if (t === 'ekle') satir++;
        else if (t === 'harf') harf[satir - 1]++; else if (t === 'ac') acik++; else kayit = true;
      }
      return { ad: ad, tur: tur, satir: satir, harf: harf, acik: acik, kayit: kayit };
    }
    const yazilan = (m, adet, imlec) => esc(m.slice(0, adet)) + (imlec ? '<span class="se-imlec" aria-hidden="true"></span>' : '') + '<span class="se-gizli" aria-hidden="true">' + esc(m.slice(adet)) + '</span>';

    const S = { demo: 'statik', n: SON, secili: 'ozel', tost: false };
    let zaman = [], basiliSecili = 'ozel';
    const temizle = () => { zaman.forEach(clearTimeout); zaman = []; };

    function boya() {
      const d = durumu(S.demo === 'statik' || S.demo === 'bitti' ? SON : S.n);
      const hazir = SABLONLAR.find(function (x) { return x.id === S.secili; });
      const oynuyor = S.demo === 'oynuyor' || S.demo === 'bekliyor';
      const sn = ADIM[S.n];
      const basili = S.demo === 'oynuyor' && sn && sn.t === 'ekle';
      const alanImlec = oynuyor && d.satir === 0 ? (d.tur > 0 || (sn && sn.t === 'tur') ? 'tur' : 'ad') : null;
      const aktif = hazir ? -1 : d.satir - 1;
      const ad = hazir ? hazir.ad : OZEL.ad, tur = hazir ? hazir.cihazTuru : OZEL.tur;
      const maddeler = hazir ? hazir.maddeler.slice(0, 4) : OZEL.maddeler;
      rk.setAttribute('data-sablon', S.demo); rk.setAttribute('data-secili', S.secili);
      [['ad', ad, d.ad], ['tur', tur, d.tur]].forEach(function (a) {
        $('[data-se="' + a[0] + '"]', rk).innerHTML = hazir ? esc(a[1]) : yazilan(a[1], a[2], alanImlec === a[0]);
      });
      if (basiliSecili !== S.secili) {
        // Fixnote'ta satırlar secili değişince yeniden oluşur (giriş animasyonu tekrar oynar)
        const rows = $('[data-se="rows"]', rk); rows.replaceWith(rows.cloneNode(true));
        basiliSecili = S.secili;
      }
      $$('[data-se="row"]', rk).forEach(function (row, i) {
        const gorunur = hazir ? true : i < d.satir, acik = hazir ? true : i < d.acik, akt = i === aktif;
        row.className = 'se-satir' + (akt ? ' se-akt' : '') + (gorunur ? '' : ' se-bos') + (hazir ? ' se-gel' : '');
        $('[data-se="rt"]', row).innerHTML = hazir ? esc(maddeler[i]) : yazilan(maddeler[i], d.harf[i], akt);
        $('.se-anahtar', row).className = acik ? 'se-anahtar se-acik' : 'se-anahtar';
      });
      $('[data-se="add"]', rk).className = basili ? 'se-ekle se-bas' : 'se-ekle';
      $('[data-se="add-t"]', rk).textContent = hazir ? (EN ? (hazir.maddeler.length - 4) + ' more steps' : (hazir.maddeler.length - 4) + ' madde daha') : EN ? 'Add step' : 'Madde ekle';
      $$('[data-se="tpl"]', rk).forEach(function (b) { b.setAttribute('aria-pressed', String(S.secili === b.getAttribute('data-id'))); });
      const oz = $('[data-se="ozel"]', rk);
      oz.className = d.kayit ? 'se-sablon se-ozel' : 'se-sablon se-ozel se-sakli';
      oz.setAttribute('aria-pressed', String(S.secili === 'ozel'));
      $('[data-se="tost"]', rk).className = S.tost ? 'se-tost se-tost-on' : 'se-tost';
    }
    function sec(id) {
      temizle(); S.n = Number.MAX_SAFE_INTEGER; S.tost = false;
      if (S.demo !== 'statik') S.demo = 'bitti';
      S.secili = id; boya();
    }
    $$('[data-se="tpl"]', rk).forEach(function (b) { b.addEventListener('click', function () { sec(b.getAttribute('data-id')); }); });
    $('[data-se="ozel"]', rk).addEventListener('click', function () { sec('ozel'); });

    if (hareketsiz()) return;
    function oynat() {
      S.demo = 'oynuyor';
      let t = 0;
      ADIM.forEach(function (a, k) { t += a.ms; zaman.push(setTimeout(function () { S.n = k + 1; boya(); }, t)); });
      zaman.push(setTimeout(function () { S.demo = 'bitti'; S.tost = true; boya(); }, t));
      zaman.push(setTimeout(function () { S.tost = false; boya(); }, t + 1800));
    }
    gorununce(rk, 0.35, function () { S.n = 0; S.demo = 'bekliyor'; boya(); }, oynat);
  }

  // ---------- MusteriGecmisi: zamanlı sıralı belirme (MG_ZAMAN) ----------
  function musteriGecmisi() {
    const rk = $('[data-mg="root"]');
    if (!rk) return;
    const MG_ZAMAN = [1100, 1450, 1900, 2150, 2800, 3450, 4100, 5000];
    const SON = MG_ZAMAN.length;
    const telEl = $('[data-mg="tel"]', rk), TEL = telEl.getAttribute('data-tam');
    const sayi = +rk.getAttribute('data-sayi'), toplam = +rk.getAttribute('data-toplam'), birim = rk.getAttribute('data-birim');
    const servisV = $('[data-mg="servis"] [data-mg="v"]', rk), toplamV = $('[data-mg="toplam"] [data-mg="v"]', rk), bekleyen = $('[data-mg="bekleyen"]', rk);
    const ks = $$('[data-k]', rk);
    const S = { demo: 'statik', harf: TEL.length, asama: SON, sayac: 1 };
    function boya() {
      const yaziyor = S.demo === 'oynuyor' && S.asama === 0;
      const hg = S.demo === 'statik' || S.demo === 'bitti' ? TEL.length : S.harf;
      telEl.innerHTML = esc(TEL.slice(0, hg)) + (yaziyor ? '<span class="se-imlec" aria-hidden="true"></span>' : '') + '<span class="se-gizli" aria-hidden="true">' + esc(TEL.slice(hg)) + '</span>';
      rk.setAttribute('data-musteri', S.demo); rk.setAttribute('data-musteri-asama', S.asama);
      ks.forEach(function (e) { e.classList.toggle('mg-on', S.asama >= +e.getAttribute('data-k')); });
      servisV.textContent = String(Math.round(sayi * S.sayac));
      toplamV.textContent = para(Math.round(toplam * S.sayac), birim, DIL, true);
      bekleyen.classList.toggle('mg-vurgu', S.asama === 7);
    }
    if (hareketsiz()) return;
    let zaman = [], raf = 0;
    function oynat() {
      S.demo = 'oynuyor'; boya();
      for (let i = 1; i <= TEL.length; i++) zaman.push(setTimeout(function () { S.harf = i; boya(); }, 300 + (i - 1) * 55));
      MG_ZAMAN.forEach(function (ms, k) { zaman.push(setTimeout(function () { S.asama = k + 1; boya(); }, ms)); });
      zaman.push(setTimeout(function () {
        const t0 = performance.now();
        const f = function (t) {
          const p = Math.min(1, (t - t0) / 900);
          S.sayac = 1 - Math.pow(1 - p, 3); boya();
          if (p < 1) raf = requestAnimationFrame(f);
        };
        raf = requestAnimationFrame(f);
      }, MG_ZAMAN[1]));
      zaman.push(setTimeout(function () { S.demo = 'bitti'; boya(); }, MG_ZAMAN[SON - 1]));
    }
    gorununce(rk, 0.35, function () { S.harf = 0; S.asama = 0; S.sayac = 0; S.demo = 'bekliyor'; boya(); }, oynat);
  }

  // ---------- WhatsAppBolum: zamanlı mesaj animasyonu (WA_ZAMAN), çift tik ----------
  function whatsapp() {
    const rk = $('[data-wa="root"]');
    if (!rk) return;
    const WA_ZAMAN = [700, 1000, 2200, 4000, 4600];
    const SON = WA_ZAMAN.length;
    const win = $('[data-wa="win"]', rk), flow = $('[data-wa="flow"]', rk), girdi = $('[data-wa="input"]', rk), gonder = $('[data-wa="gonder"]', rk);
    const ks = $$('[data-k]', rk), t2 = $$('.wa-t2', rk);
    const S = { demo: 'statik', asama: SON, fark: 0 };
    function boya() {
      rk.setAttribute('data-wa-asama', S.asama);
      ks.forEach(function (e) { e.classList.toggle('wa-on', S.asama >= +e.getAttribute('data-k')); });
      t2.forEach(function (e) { e.style.display = S.asama >= 4 ? '' : 'none'; });
      girdi.textContent = S.asama < 2 ? girdi.getAttribute('data-prev') : girdi.getAttribute('data-vazgec');
      girdi.style.color = S.asama < 2 ? 'var(--fx-sheet-ink)' : 'var(--fx-sheet-faint)';
      gonder.className = S.asama === 1 ? 'wa-gonder wa-basili' : 'wa-gonder';
      flow.className = S.demo === 'oynuyor' ? 'wa-akis wa-kayar' : 'wa-akis';
      flow.style.transform = 'translateY(' + (S.asama < 3 ? S.fark : 0) + 'px)';
    }
    function olc() { S.fark = Math.max(0, flow.offsetHeight - win.clientHeight); boya(); }
    const ro = new ResizeObserver(olc); ro.observe(win); ro.observe(flow);
    olc();
    if (hareketsiz()) return;
    gorununce(rk, 0.35, function () { S.asama = 0; S.demo = 'bekliyor'; boya(); }, function () {
      S.demo = 'oynuyor'; boya();
      WA_ZAMAN.forEach(function (ms, k) { setTimeout(function () { S.asama = k + 1; boya(); }, ms); });
      setTimeout(function () { S.demo = 'bitti'; boya(); }, WA_ZAMAN[SON - 1]);
    });
  }

  // ---------- Fiyat: Aylık/Yıllık anahtarı, ekip kişi sayısı ----------
  const FT = {
    tr: {
      tlAy: 'TL / ay', ay: '/ ay', yillikAlt: (t) => 'Yıllık ' + t + ' peşin · KDV dahil', aylikAlt: 'Aylık ödeme · KDV dahil',
      ucuz: (t) => 'Usta paketinden kişi başı ' + t + ' ucuz', ucuzDegil: "3. teknisyenden itibaren Usta'dan ucuz",
    },
    en: {
      tlAy: 'TL / month', ay: '/ month', yillikAlt: (t) => t + ' billed yearly · TRY, VAT included', aylikAlt: 'Billed monthly · TRY, VAT included',
      ucuz: (t) => t + ' less per person than Solo', ucuzDegil: 'Cheaper than Solo from the 3rd technician',
    },
  }[DIL];
  const secimAdresi = (p, yillik) => FIXNOTE + '/giris?kayit=1&sonra=' + encodeURIComponent('/abonelik?paket=' + p + '&donem=' + (yillik ? 'yillik' : 'aylik'));
  const kurus = (tl) => Math.round(tl * 100);
  const fiyat = (k) => tlSayi(k / 100, DIL) + ' TL';

  function fiyatlar() {
    const rk = $('[data-fx="fiyat"]');
    if (!rk) return;
    let yillik = true, ekip = 4;
    const donemler = $$('[data-fx="donem"]', rk), ekipN = $('[data-fx="ekip-n"]', rk), azalt = $('[data-ekip="azalt"]', rk), artir = $('[data-ekip="artir"]', rk);
    const kisiEl = $('[data-kisi-basi]', rk), kiyasEl = $('[data-fiyat-kiyas]', rk);
    function satir(p, koyu) {
      const soluk = koyu ? 'rgba(255,255,255,.62)' : 'var(--fx-muted)';
      const aylik = kurus(yillik ? p.yil / 12 : p.ay);
      return '<div style="display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 8px"><span class="num" style="font-size:clamp(38px, 10vw, 48px);font-weight:800;letter-spacing:-0.045em;line-height:1">' + tlSayi(aylik / 100, DIL) + '</span>' +
        '<span style="font-size:14px;color:' + soluk + ';font-weight:700">' + FT.tlAy + '</span>' +
        (yillik ? '<s class="num" style="font-size:14px;color:' + soluk + ';font-weight:600">' + fiyat(kurus(p.ay)) + '</s>' : '') + '</div>' +
        '<div style="font-size:12.5px;color:' + soluk + ';font-weight:600;margin-top:8px;line-height:1.5">' + (yillik ? FT.yillikAlt(fiyat(kurus(p.yil))) : FT.aylikAlt) + '</div>';
    }
    function boya() {
      rk.setAttribute('data-fiyat', yillik ? 'yillik' : 'aylik');
      donemler.forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-yillik') === 'true') === yillik)); });
      $('[data-paket="usta"] [data-fiyat-tutar]', rk).innerHTML = satir(PAKET.usta, false);
      $('[data-paket="firma"] [data-fiyat-tutar]', rk).innerHTML = satir(PAKET.firma, true);
      const firmaAylik = yillik ? PAKET.firma.yil / 12 : PAKET.firma.ay;
      const kisiBasi = kurus(firmaAylik / ekip), ustaAylik = kurus(yillik ? PAKET.usta.yil / 12 : PAKET.usta.ay);
      ekipN.textContent = ekip;
      kisiEl.textContent = fiyat(kisiBasi);
      kiyasEl.textContent = kisiBasi < ustaAylik ? FT.ucuz(fiyat(ustaAylik - kisiBasi)) : FT.ucuzDegil;
      azalt.disabled = ekip <= 2; azalt.style.opacity = ekip <= 2 ? '0.35' : '1';
      artir.disabled = ekip >= 50; artir.style.opacity = ekip >= 50 ? '0.35' : '1';
      $$('[data-paket-sec]', rk).forEach(function (a) { a.href = secimAdresi(a.getAttribute('data-paket-sec'), yillik); });
    }
    donemler.forEach(function (b) { b.addEventListener('click', function () { yillik = b.getAttribute('data-yillik') === 'true'; boya(); }); });
    azalt.addEventListener('click', function () { ekip = Math.max(2, ekip - 1); boya(); });
    artir.addEventListener('click', function () { ekip = Math.min(50, ekip + 1); boya(); });
    boya();
  }

  gorununceOynat();
  hero();
  sureHesap();
  ornekRapor();
  isDongu();
  sablon();
  musteriGecmisi();
  whatsapp();
  fiyatlar();
})();
