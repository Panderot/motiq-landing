// MotiqAI paketleri, fiyatları ve ödeme linkleri: TEK KAYNAK.
// fiyatlar.html, siparis.html ve functions/api/siparis.js bu dosyayı okur.
// Fiyat değiştirmek için sadece FIYATLAR bloğunu değiştir.
// Tüm fiyatlar Türk lirası ve KDV dahildir.

// >>> FİYATLAR (TL, KDV dahil) <<<
export const FIYATLAR = {
  usta_aylik: 499,
  usta_yillik: 4790,
  firma_aylik: 1249,
  firma_yillik: 11990,
  web_sitesi: 19900,
  otomasyon: 14900,
  sosyal_medya: 7900,
};
// >>> FİYATLAR SONU <<<

// >>> ÖDEME LİNKLERİ <<<
// iyzico ödeme linki gelince ilgili paketin tırnakları arasına yapıştır.
// Link doluysa "Satın al / Abone ol" düğmesi doğrudan o linke gider (yeni sekmede).
// Boşsa düğme siparis.html?paket=<anahtar> sayfasına gider.
export const ODEME_LINKLERI = {
  usta_aylik: "",
  usta_yillik: "",
  firma_aylik: "",
  firma_yillik: "",
  web_sitesi: "",
  otomasyon: "",
  sosyal_medya: "",
};
// >>> ÖDEME LİNKLERİ SONU <<<

const FIXNOTE_ORTAK = [
  "Sınırsız servis raporu (rapor başına ücret yok)",
  "Telefonda doldur, müşteri ekranda imzalasın",
  "Firma başlıklı A4 PDF rapor",
  "WhatsApp'tan gönderme",
  "Müşteri geçmişi",
  "Bulutta kayıt",
  "İnternetsizken çalışır, sonra eşitler",
];

// Fixnote planları (fiyatlar sayfasındaki Aylık/Yıllık anahtarı bu planları kullanır).
export const FIXNOTE_PLANLARI = [
  {
    id: "usta",
    ad: "Usta",
    aciklama: "Tek başına çalışan teknisyen için.",
    kapsam: "1 teknisyen",
    ozellikler: FIXNOTE_ORTAK,
    anahtarlar: { aylik: "usta_aylik", yillik: "usta_yillik" },
  },
  {
    id: "firma",
    ad: "Firma",
    aciklama: "Ekibiyle çalışan servis firmaları için.",
    kapsam: "Sınırsız teknisyen + ekip sistemi",
    ozellikler: [...FIXNOTE_ORTAK, "Ekip yönetimi", "Sınırsız teknisyen"],
    anahtarlar: { aylik: "firma_aylik", yillik: "firma_yillik" },
  },
];

// Satın alınabilir her paket. Anahtarlar FIYATLAR ve ODEME_LINKLERI ile aynıdır.
// tur: "abonelik" (Abonelik Koşulları + Ön Bilgilendirme ve Mesafeli Sözleşme)
//      "proje"    (sadece işletmeler ve serbest çalışanlar; Genel Hizmet Şartları)
export const PAKETLER = {
  usta_aylik: {
    tur: "abonelik", kategori: "fixnote", ad: "Fixnote Usta (aylık)",
    aciklama: "Saha servis ekipleri için dijital servis raporu. 1 teknisyen.",
    ozellikler: FIXNOTE_PLANLARI[0].ozellikler,
    fiyat: FIYATLAR.usta_aylik, donem: "ay", teslim: "Ödeme onaylanınca anında, elektronik ortamda",
  },
  usta_yillik: {
    tur: "abonelik", kategori: "fixnote", ad: "Fixnote Usta (yıllık peşin)",
    aciklama: "Saha servis ekipleri için dijital servis raporu. 1 teknisyen.",
    ozellikler: FIXNOTE_PLANLARI[0].ozellikler,
    fiyat: FIYATLAR.usta_yillik, donem: "yıl", teslim: "Ödeme onaylanınca anında, elektronik ortamda",
  },
  firma_aylik: {
    tur: "abonelik", kategori: "fixnote", ad: "Fixnote Firma (aylık)",
    aciklama: "Saha servis ekipleri için dijital servis raporu. Sınırsız teknisyen ve ekip sistemi.",
    ozellikler: FIXNOTE_PLANLARI[1].ozellikler,
    fiyat: FIYATLAR.firma_aylik, donem: "ay", teslim: "Ödeme onaylanınca anında, elektronik ortamda",
  },
  firma_yillik: {
    tur: "abonelik", kategori: "fixnote", ad: "Fixnote Firma (yıllık peşin)",
    aciklama: "Saha servis ekipleri için dijital servis raporu. Sınırsız teknisyen ve ekip sistemi.",
    ozellikler: FIXNOTE_PLANLARI[1].ozellikler,
    fiyat: FIYATLAR.firma_yillik, donem: "yıl", teslim: "Ödeme onaylanınca anında, elektronik ortamda",
  },
  web_sitesi: {
    tur: "proje", kategori: "web-sitesi", ad: "Kurumsal Tanıtım Sitesi",
    aciklama: "İşletmenizi anlatan, mobil uyumlu kurumsal web sitesi.",
    ozellikler: [
      "5 sayfaya kadar",
      "Mobil uyumlu tasarım",
      "İletişim formu",
      "Temel SEO",
      "KVKK ve çerez metinleri sayfaları",
      "2 revizyon hakkı",
    ],
    fiyat: FIYATLAR.web_sitesi, donem: null, teslim: "İçerik tesliminden sonra 10 iş günü",
  },
  otomasyon: {
    tur: "proje", kategori: "otomasyon", ad: "Tek İş Akışı Otomasyonu",
    aciklama: "Tekrarlanan tek bir süreci uçtan uca otomatikleştiriyoruz.",
    ozellikler: [
      "Tek bir süreç (ör. form → tablo → e-posta/WhatsApp bildirimi)",
      "Kurulum",
      "Kullanım anlatımı",
      "30 gün destek",
    ],
    fiyat: FIYATLAR.otomasyon, donem: null, teslim: "7 iş günü",
  },
  sosyal_medya: {
    tur: "proje", kategori: "sosyal-medya", ad: "Aylık Sosyal Medya Paketi",
    aciklama: "Yapay zeka destekli görsel ve video üretimiyle her ay düzenli içerik.",
    ozellikler: [
      "Ayda 20 görsel + 4 kısa video",
      "Marka renklerinize uygun",
      "1 revizyon turu",
    ],
    fiyat: FIYATLAR.sosyal_medya, donem: "ay", teslim: "Her ayın ilk 5 iş günü içinde",
  },
};

// 19900 -> "19.900 TL"
export function tl(tutar) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(tutar) + " TL";
}

// Yıllık peşin fiyatın aylık fiyata göre indirim yüzdesi (ör. 20).
export function yillikIndirim(aylik, yillik) {
  return Math.round((1 - yillik / (aylik * 12)) * 100);
}
