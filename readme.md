# Serbest Meslek Makbuzu Hesaplama Aracı - Kullanım Kılavuzu (Son Versiyon)

## Genel Bakış
NOT: Proje Manus ile geliştirilmeye başlandı. 

Bu web uygulaması, Türkiye'de avukatlar için serbest meslek makbuzu hesaplamalarını ve faiz hesaplamalarını kolaylaştırmak amacıyla geliştirilmiştir. Uygulama, güncel vergi oranlarını kullanarak doğru hesaplamalar yapmanıza yardımcı olur.

## Erişim

Uygulamaya şu adresten erişebilirsiniz: [https://makbuz.vercel.app/](https://makbuz.vercel.app/)

Uygulama tamamen mobil uyumludur ve herhangi bir cihazdan (bilgisayar, tablet veya akıllı telefon) kullanılabilir.

## Özellikler

Uygulama iki ana bölümden oluşmaktadır:

1. **Serbest Meslek Makbuzu Hesaplama**
2. **Faiz Hesaplama**

## Serbest Meslek Makbuzu Hesaplama Kullanımı

### Adım 1: KDV ve Stopaj Dahil Toplam Tutarı Girin
- "KDV ve Stopaj Dahil Toplam Tutar (TL)" alanına hesaplamak istediğiniz toplam tutarı girin.

### Adım 2: KDV Oranını Seçin
- Uygun KDV oranını seçin:
  - **%20 (Genel)**: Genel avukatlık hizmetleri için
  - **%10 (Çocuk Mahkemeleri)**: Çocuk mahkemelerinde ifa edilen görevler için

### Adım 3: Stopaj Oranını Seçin
- Uygun stopaj oranını seçin:
  - **%20**: Standart stopaj oranı
  - **%0 (Stopaj Yok)**: Stopaj uygulanmayacak durumlar için

### Adım 4: Tevkifat Seçeneğini Belirleyin
- Tevkifat uygulaması için seçenek belirleyin:
  - **Otomatik (9.900 TL üzeri için)**: KDV dahil tutar 9.900 TL'yi aştığında otomatik olarak tevkifat uygular
  - **Evet (Manuel)**: Tutardan bağımsız olarak tevkifat uygular
  - **Hayır**: Tevkifat uygulamaz

### Adım 5: Hesapla Butonuna Tıklayın
- "Hesapla" butonuna tıklayarak sonuçları görüntüleyin.

### Sonuçlar
Hesaplama sonucunda şu bilgiler görüntülenir:
- Brüt Tutar (Girdiğiniz toplam tutardan hesaplanır)
- KDV Tutarı
- Tevkifat Tutarı
- Tahsil Edilecek KDV
- Stopaj Tutarı
- KDV Dahil Toplam
- Net Tahsilat

### Hesaplama Geçmişi
- Yaptığınız hesaplamalar otomatik olarak kaydedilir ve "Hesaplama Geçmişi" bölümünde listelenir.
- Geçmiş bir hesaplamaya tıklayarak o hesaplamanın detaylarını tekrar görüntüleyebilirsiniz.

## Faiz Hesaplama Kullanımı

### Adım 1: Anapara Tutarını Girin
- "Anapara (TL)" alanına faiz hesaplaması yapmak istediğiniz tutarı girin.

### Adım 2: Faiz Oranını Girin
- "Faiz Oranı (%)" alanına yıllık faiz oranını girin.

### Adım 3: Faiz Türünü Seçin
- Uygun faiz türünü seçin:
  - **Basit Faiz**: Standart basit faiz hesaplaması
  - **Temerrüt Faizi**: Temerrüt durumunda uygulanan faiz hesaplaması

### Adım 4: Tarih Aralığını Belirleyin
- "Başlangıç Tarihi" ve "Bitiş Tarihi" alanlarını kullanarak faiz hesaplanacak tarih aralığını belirleyin.

### Adım 5: Hesapla Butonuna Tıklayın
- "Hesapla" butonuna tıklayarak sonuçları görüntüleyin.

### Sonuçlar
Hesaplama sonucunda şu bilgiler görüntülenir:
- Anapara
- Faiz Oranı
- Gün Sayısı
- Faiz Tutarı
- Toplam Tutar

### Hesaplama Geçmişi
- Yaptığınız hesaplamalar otomatik olarak kaydedilir ve "Hesaplama Geçmişi" bölümünde listelenir.
- Geçmiş bir hesaplamaya tıklayarak o hesaplamanın detaylarını tekrar görüntüleyebilirsiniz.

## Vergi Oranları Hakkında Bilgiler

### KDV Oranları
- **Genel avukatlık hizmetleri**: %20
- **Çocuk Mahkemeleri'nde ifa edilen görevler**: %10

### Tevkifat (KDV Kesintisi)
- KDV dahil 9.900 TL'yi aşan hizmetler için: %50 (5/10) oranında tevkifat uygulanır
- KDV dahil 9.900 TL altındaki hizmetler için: Tevkifat uygulanmaz

### Stopaj (Gelir Vergisi Kesintisi)
- Stopaj oranı: %20
- Stopaj, müşterinin (şirket ya da kamu kurumu) sorumluluğunda olup vergi dairesine yatırılır
- Avukatın yıllık beyanından mahsup edilir

## Teknik Bilgiler

- Uygulama, tarayıcınızın yerel depolama özelliğini kullanarak hesaplama geçmişinizi kaydeder.
- Verileriniz sadece kendi cihazınızda saklanır, herhangi bir sunucuya gönderilmez.
- Hesaplamalar tamamen istemci tarafında (client-side) yapılır.

## İletişim ve Destek

Uygulama ile ilgili sorularınız veya geri bildirimleriniz için lütfen iletişime geçin.

---

© 2025 Serbest Meslek Makbuzu Hesaplama Aracı
