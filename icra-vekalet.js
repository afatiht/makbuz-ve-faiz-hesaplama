/**
 * İcra Vekalet Ücreti Hesaplama - AAÜT 2025-2026
 * İcra dosyalarında kesinleşme öncesi ve sonrası vekalet ücreti hesaplama
 */

// İcra Vekalet Ücreti Sabitleri (AAÜT 2025-2026)
const ICRA_AAUT = {
    yil: '2025-2026',

    // Maktu ücretler
    maktuIcra: 9000,           // Genel icra takibi maktu ücreti
    maktuTahliye: 20000,       // Tahliye icra takibi
    maktuIcraMahkemesi: 11000, // İcra Mahkemesi işleri (AAÜT 2025-2026)

    // Nispi hesaplama eşiği
    // Nispi hesaplama sonucu maktu ücretten düşük olamaz
    // 9.000 TL / 0.16 = 56.250 TL (bu tutara kadar maktu ücret uygulanır)
    nispiEsik: 56250,

    // Nispi ücret dilimleri (Vekalet modülündeki ile aynı)
    nispiDilimler: [
        { limit: 600000, oran: 0.16 },
        { limit: 600000, oran: 0.15 },
        { limit: 1200000, oran: 0.14 },
        { limit: 1200000, oran: 0.13 },
        { limit: 1800000, oran: 0.11 },
        { limit: 2400000, oran: 0.08 },
        { limit: 3000000, oran: 0.05 },
        { limit: 3600000, oran: 0.03 },
        { limit: Infinity, oran: 0.01 }
    ],

    // Erken ödeme indirimi (7 gün içinde ödeme)
    erkenOdemeOrani: 0.75, // %75'i ödenir (1/4 indirim)

    // İcra masrafları (2025 Resmi Rakamlar)
    masraflar: {
        basvuruHarci: 615.40,         // İcra başvuru harcı
        vekaletnameHarci: 87.50,       // Vekalet suret harcı
        vekaletPulu: 138.00,           // Vekalet pulu
        tebligatUcreti: 250,           // Tahmini tebligat ve posta (2025 ortalama)
        dosyaMasrafi: 100              // Tahmini dosya masrafı
    },

    // Oranlar (2025)
    oranlar: {
        pesinHarc: 0.005,              // Peşin harç (binde 5) - İlamsız takiplerde
        tahsilHarciHacizOncesi: 0.0455, // Tahsil harcı (Hacizden önce ödeme)
        tahsilHarciHaricen: 0.0227      // Haricen tahsilat (Dışarıdan ödeme bildirimi)
    }
};

// İcra Vekalet Ücreti Hesaplama Servisi
const IcraVekaletService = {
    /**
     * Nispi icra vekalet ücreti hesapla
     * @param {number} takipTutari - İcra takip tutarı (TL)
     * @returns {Object} - Hesaplama sonucu
     */
    hesaplaNispiUcret: (takipTutari) => {
        if (takipTutari <= 0) {
            return { ucret: 0, detaylar: [] };
        }

        // Eşik değerin altındaysa maktu ücret uygula
        if (takipTutari <= ICRA_AAUT.nispiEsik) {
            return {
                ucret: ICRA_AAUT.maktuIcra,
                maktuUygulandi: true,
                aciklama: `Takip tutarı ${Utils.formatCurrency(ICRA_AAUT.nispiEsik)} altında olduğundan maktu ücret uygulanır`
            };
        }

        let kalanDeger = takipTutari;
        let toplamUcret = 0;
        const detaylar = [];
        let oncekiToplam = 0;

        for (const dilim of ICRA_AAUT.nispiDilimler) {
            if (kalanDeger <= 0) break;

            const dilimDegeri = Math.min(kalanDeger, dilim.limit);
            const dilimUcreti = dilimDegeri * dilim.oran;

            if (dilimDegeri > 0) {
                detaylar.push({
                    aralik: `${Utils.formatCurrency(oncekiToplam)} - ${Utils.formatCurrency(oncekiToplam + dilimDegeri)}`,
                    deger: dilimDegeri,
                    oran: dilim.oran * 100,
                    ucret: dilimUcreti
                });

                toplamUcret += dilimUcreti;
            }

            kalanDeger -= dilimDegeri;
            oncekiToplam += dilim.limit === Infinity ? 0 : dilim.limit;
        }

        // Nispi ücret asıl alacağı geçemez
        if (toplamUcret > takipTutari) {
            toplamUcret = takipTutari;
        }

        // Nispi ücret maktu ücretten az olamaz
        if (toplamUcret < ICRA_AAUT.maktuIcra) {
            return {
                ucret: ICRA_AAUT.maktuIcra,
                maktuUygulandi: true,
                aciklama: 'Nispi hesaplama maktu ücretten düşük olduğundan maktu ücret uygulanır'
            };
        }

        return {
            ucret: toplamUcret,
            detaylar: detaylar,
            maktuUygulandi: false
        };
    },

    /**
     * İcra dosyası toplam tutar hesaplama
     * Kesinleşme öncesi ve sonrası için
     * @param {number} anaparaTutari - Anapara tutarı
     * @param {number} faizTutari - İşlemiş faiz tutarı (varsa)
     * @param {boolean} erkenOdeme - 7 gün içinde ödeme durumu
     * @returns {Object} - Detaylı hesaplama
     */
    hesaplaIcraDosyasi: (anaparaTutari, faizTutari = 0, erkenOdeme = false) => {
        const takipTutari = anaparaTutari + faizTutari;

        // Vekalet ücreti hesapla (Tam ücret)
        const vekaletSonuc = IcraVekaletService.hesaplaNispiUcret(takipTutari);
        const tamVekaletUcreti = vekaletSonuc.ucret;

        // Erken ödeme indirimi (Sadece kesinleşme öncesi için geçerli olabilir)
        const indirimliVekaletUcreti = erkenOdeme
            ? tamVekaletUcreti * ICRA_AAUT.erkenOdemeOrani
            : tamVekaletUcreti;

        // Masraflar
        const masraflar = ICRA_AAUT.masraflar;
        const toplamMasraf = masraflar.basvuruHarci + masraflar.vekaletnameHarci +
            masraflar.vekaletPulu + masraflar.tebligatUcreti + masraflar.dosyaMasrafi;

        // Peşin harç (binde 5)
        const pesinHarc = takipTutari * ICRA_AAUT.oranlar.pesinHarc;

        // Kesinleşme öncesi toplam (İndirimli vekalet ücreti kullanılırsa)
        const kesinlesmeOncesi = {
            anapara: anaparaTutari,
            faiz: faizTutari,
            takipTutari: takipTutari,
            vekaletUcreti: indirimliVekaletUcreti,
            vekaletUcretiAciklama: vekaletSonuc.aciklama || (erkenOdeme ? 'Erken ödeme indirimi uygulandı (%75)' : ''),
            pesinHarc: pesinHarc,
            masraflar: toplamMasraf,
            toplam: takipTutari + indirimliVekaletUcreti + pesinHarc + toplamMasraf
        };

        // Tahsil harcı (%4.55) - kesinleşme sonrası ödenir
        // Not: Peşin harç tahsil harcından mahsup edilir
        const toplamTahsilHarci = takipTutari * ICRA_AAUT.oranlar.tahsilHarciHacizOncesi;
        const kalanTahsilHarci = Math.max(0, toplamTahsilHarci - pesinHarc);

        // Kesinleşme sonrası toplam (Her zaman tam vekalet ücreti kullanılır)
        const kesinlesmeSonrasi = {
            anapara: anaparaTutari,
            faiz: faizTutari,
            takipTutari: takipTutari,
            vekaletUcreti: tamVekaletUcreti,
            vekaletUcretiAciklama: vekaletSonuc.aciklama || '',
            pesinHarc: pesinHarc,
            tahsilHarci: kalanTahsilHarci,
            toplamTahsilHarci: toplamTahsilHarci,
            masraflar: toplamMasraf,
            toplam: takipTutari + tamVekaletUcreti + pesinHarc + kalanTahsilHarci + toplamMasraf
        };

        return {
            kesinlesmeOncesi,
            kesinlesmeSonrasi,
            vekaletDetay: vekaletSonuc.detaylar || [],
            erkenOdemeUygulandi: erkenOdeme
        };
    },

    /**
     * Vekalet ücretinden anapara bul (Matematiksel ters hesaplama)
     * @param {number} vekaletUcreti - Ödenmesi gereken veya takdir edilen vekalet ücreti
     * @returns {number} - Hesaplanan anapara tutarı
     */
    vekaletUcretindenAnaparaBul: (vekaletUcreti) => {
        if (vekaletUcreti <= ICRA_AAUT.maktuIcra) {
            return ICRA_AAUT.nispiEsik; // Maktu ücret sınırı
        }

        let kalanUcret = vekaletUcreti;
        let anapara = 0;
        let oncekiLimit = 0;

        for (const dilim of ICRA_AAUT.nispiDilimler) {
            const dilimKapasiteUcreti = (dilim.limit === Infinity) ? Infinity : dilim.limit * dilim.oran;

            if (kalanUcret <= dilimKapasiteUcreti) {
                anapara += kalanUcret / dilim.oran;
                kalanUcret = 0;
                break;
            } else {
                anapara += dilim.limit;
                kalanUcret -= dilimKapasiteUcreti;
            }
        }

        return Math.round(anapara * 100) / 100;
    },

    /**
     * Masraf detaylarını getir
     */
    getMasrafDetaylari: () => {
        return Object.entries(ICRA_AAUT.masraflar).map(([key, value]) => {
            const isimler = {
                basvuruHarci: 'Başvuru Harcı',
                vekaletnameHarci: 'Vekalet Suret Harcı',
                vekaletPulu: 'Vekalet Pulu',
                tebligatUcreti: 'Tebligat Ücreti',
                dosyaMasrafi: 'Dosya Masrafı'
            };
            return { ad: isimler[key] || key, tutar: value };
        });
    }
};

// İcra Vekalet UI kontrolü
document.addEventListener('DOMContentLoaded', function () {
    const icraContent = document.getElementById('icra-content');
    if (!icraContent) return;

    // Form elementleri
    const icraForm = document.getElementById('icra-form');
    const hesapTuruSelect = document.getElementById('icra-hesap-turu');
    const anaparaAlani = document.getElementById('icra-anapara-alani');
    const vekaletAlani = document.getElementById('icra-vekalet-alani');

    const anaparaInput = document.getElementById('icra-anapara');
    const faizInput = document.getElementById('icra-faiz');
    const vekaletInput = document.getElementById('icra-vekalet-input');

    const icraResult = document.getElementById('icra-result');
    const icraHistory = document.getElementById('icra-history');

    // Input maskeleme
    if (anaparaInput) InputMask.attach(anaparaInput);
    if (faizInput) InputMask.attach(faizInput);
    if (vekaletInput) InputMask.attach(vekaletInput);

    // Hesaplama yöntemi değişimi
    if (hesapTuruSelect) {
        hesapTuruSelect.addEventListener('change', function () {
            if (this.value === 'anapara') {
                anaparaAlani.style.display = 'block';
                vekaletAlani.style.display = 'none';
                anaparaInput.required = true;
                vekaletInput.required = false;
            } else {
                anaparaAlani.style.display = 'none';
                vekaletAlani.style.display = 'block';
                anaparaInput.required = false;
                vekaletInput.required = true;
            }
        });
    }

    // Hesaplama geçmişi
    let icraHistoryData = JSON.parse(localStorage.getItem('icraHistory')) || [];

    // Form submit
    if (icraForm) {
        icraForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let anapara, faiz;

            if (hesapTuruSelect.value === 'anapara') {
                anapara = Utils.parseCurrency(anaparaInput.value);
                faiz = Utils.parseCurrency(faizInput.value) || 0;
            } else {
                const girilenVekalet = Utils.parseCurrency(vekaletInput.value);
                if (girilenVekalet <= 0) {
                    alert('Lütfen geçerli bir vekalet ücreti giriniz.');
                    return;
                }
                anapara = IcraVekaletService.vekaletUcretindenAnaparaBul(girilenVekalet);
                faiz = 0;
            }

            if (anapara <= 0) {
                alert('Lütfen geçerli bilgiler giriniz.');
                return;
            }

            // Erken ödeme artık opsiyonel DEĞİL, her iki kart da gösterileceği için 
            // hesaplaIcraDosyasi'na her zaman true gönderiyoruz ya da fonksiyonu otonom yapıyoruz.
            // Buradaki true parametresi sadece kesinlesmeOncesi kartının indirim uygulamasını sağlar.
            const sonuc = IcraVekaletService.hesaplaIcraDosyasi(anapara, faiz, true);
            gosterSonuc(sonuc);

            // Geçmişe ekle
            const hesaplama = {
                tarih: new Date().toLocaleString('tr-TR'),
                anapara: anapara,
                faiz: faiz,
                // Kayıt için eski flag'i pasif tutuyoruz veya kaldırabiliriz
                erkenOdeme: true,
                kesinlesmeOncesi: sonuc.kesinlesmeOncesi.toplam,
                kesinlesmeSonrasi: sonuc.kesinlesmeSonrasi.toplam
            };

            icraHistoryData.unshift(hesaplama);
            if (icraHistoryData.length > 10) {
                icraHistoryData.pop();
            }
            localStorage.setItem('icraHistory', JSON.stringify(icraHistoryData));
            updateIcraHistory();
        });
    }

    // Sonuç göster
    function gosterSonuc(sonuc) {
        const ko = sonuc.kesinlesmeOncesi;
        const ks = sonuc.kesinlesmeSonrasi;

        let html = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Kesinleşme Öncesi -->
                <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0284c7;">
                    <h4 style="color: #0284c7; margin-bottom: 15px;">📋 Kesinleşme Öncesi</h4>
                    <div class="result-item">
                        <span>Anapara:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ko.anapara))}</span>
                    </div>
                    ${ko.faiz > 0 ? `
                    <div class="result-item">
                        <span>İşlemiş Faiz:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ko.faiz))}</span>
                    </div>` : ''}
                    <div class="result-item">
                        <span>Takip Tutarı:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ko.takipTutari))}</span>
                    </div>
                    <div class="result-item">
                        <span>Vekalet Ücreti:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ko.vekaletUcreti))}</span>
                    </div>
                    ${ko.vekaletUcretiAciklama ? `<div style="font-size: 12px; color: #666; margin-bottom: 10px;">${Utils.escapeHTML(ko.vekaletUcretiAciklama)}</div>` : ''}
                    <div class="result-item">
                        <span>Peşin Harç (%0,5):</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ko.pesinHarc))}</span>
                    </div>
                    <div class="result-item">
                        <span>Masraflar:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ko.masraflar))}</span>
                    </div>
                    <div class="result-item" style="font-size: 18px; font-weight: bold; background: #dbeafe; padding: 10px; border-radius: 5px; margin-top: 10px;">
                        <span>TOPLAM:</span>
                        <div>
                            <span style="color: #1e40af;">${Utils.escapeHTML(Utils.formatCurrency(ko.toplam))}</span>
                            <button class="copy-btn" onclick="Utils.handleCopyClick(this, '${Utils.formatNumber(ko.toplam)}')">Kopyala</button>
                        </div>
                    </div>
                </div>

                <!-- Kesinleşme Sonrası -->
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
                    <h4 style="color: #16a34a; margin-bottom: 15px;">✅ Kesinleşme Sonrası</h4>
                    <div class="result-item">
                        <span>Anapara:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ks.anapara))}</span>
                    </div>
                    ${ks.faiz > 0 ? `
                    <div class="result-item">
                        <span>İşlemiş Faiz:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ks.faiz))}</span>
                    </div>` : ''}
                    <div class="result-item">
                        <span>Takip Tutarı:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ks.takipTutari))}</span>
                    </div>
                    <div class="result-item">
                        <span>Vekalet Ücreti:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ks.vekaletUcreti))}</span>
                    </div>
                    <div class="result-item">
                        <span>Peşin Harç (%0,5):</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ks.pesinHarc))}</span>
                    </div>
                    <div class="result-item">
                        <span>Tahsil Harcı (%4,55):</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ks.tahsilHarci))}</span>
                    </div>
                    <div style="font-size: 11px; color: #666; margin-bottom: 5px;">* Peşin harç tahsil harcından mahsup edilmiştir. Toplam tahsil harcı: ${Utils.escapeHTML(Utils.formatCurrency(ks.toplamTahsilHarci))}</div>
                    <div class="result-item">
                        <span>Masraflar:</span>
                        <span>${Utils.escapeHTML(Utils.formatCurrency(ks.masraflar))}</span>
                    </div>
                    <div class="result-item" style="font-size: 18px; font-weight: bold; background: #dcfce7; padding: 10px; border-radius: 5px; margin-top: 10px;">
                        <span>TOPLAM:</span>
                        <div>
                            <span style="color: #166534;">${Utils.escapeHTML(Utils.formatCurrency(ks.toplam))}</span>
                            <button class="copy-btn" onclick="Utils.handleCopyClick(this, '${Utils.formatNumber(ks.toplam)}')">Kopyala</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h4 style="color: #b45309; margin-bottom: 10px;">📊 Fark Analizi</h4>
                <div class="result-item">
                    <span>Kesinleşme ile Fark (Kalan Tahsil Harcı):</span>
                    <span style="color: #b45309; font-weight: bold;">${Utils.escapeHTML(Utils.formatCurrency(ks.toplam - ko.toplam))}</span>
                </div>
            </div>
        `;

        // Erken ödeme bilgisi
        if (sonuc.erkenOdemeUygulandi) {
            html += `
                <div style="margin-top: 15px; padding: 10px; background: #ede9fe; border-radius: 8px;">
                    <span style="color: #6b21a8;">💡 7 gün içinde ödeme indirimi uygulandı (vekalet ücretinin %75'i)</span>
                </div>
            `;
        }

        document.getElementById('icra-sonuc-icerik').innerHTML = html;
        icraResult.style.display = 'block';
    }

    // Geçmiş güncelle
    function updateIcraHistory() {
        if (!icraHistory) return;

        if (icraHistoryData.length === 0) {
            icraHistory.innerHTML = '<p>Henüz hesaplama yapılmadı.</p>';
            return;
        }

        let html = '';
        icraHistoryData.forEach((item, index) => {
            html += `
                <div class="history-item" data-index="${index}">
                    <div class="history-date">${Utils.escapeHTML(item.tarih)}</div>
                    <div>Anapara: ${Utils.escapeHTML(Utils.formatCurrency(item.anapara))} | Önce: ${Utils.escapeHTML(Utils.formatCurrency(item.kesinlesmeOncesi))} | Sonra: ${Utils.escapeHTML(Utils.formatCurrency(item.kesinlesmeSonrasi))}</div>
                </div>
            `;
        });

        icraHistory.innerHTML = html;

        // Tıklama olayı
        document.querySelectorAll('#icra-history .history-item').forEach(item => {
            item.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                const hesaplama = icraHistoryData[index];

                anaparaInput.value = Utils.formatNumber(hesaplama.anapara);
                if (faizInput) {
                    faizInput.value = Utils.formatNumber(hesaplama.faiz || 0);
                }

                // Hesaplama türünü anaparaya çek (geçmişten yükleme anapara üzerinden yapılır)
                hesapTuruSelect.value = 'anapara';
                anaparaAlani.style.display = 'block';
                vekaletAlani.style.display = 'none';

                icraForm.dispatchEvent(new Event('submit'));
            });
        });
    }

    // Sayfa yüklendiğinde geçmişi göster
    updateIcraHistory();
});
