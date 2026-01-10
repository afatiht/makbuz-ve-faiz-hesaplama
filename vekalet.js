/**
 * Vekalet Ücreti Hesaplama - AAÜT 2025-2026 Entegrasyonu
 * Avukatlık Asgari Ücret Tarifesi hesaplama modülü
 */

// AAÜT 2025-2026 Tarifeleri
const AAUT = {
    yil: '2025-2026',
    yururlukTarihi: '04.11.2025',

    // Nispi ücret dilimleri (konusu para olan işler)
    nispiDilimler: [
        { limit: 600000, oran: 0.16, aciklama: 'İlk 600.000 TL için %16' },
        { limit: 600000, oran: 0.15, aciklama: 'Sonra gelen 600.000 TL için %15' },
        { limit: 1200000, oran: 0.14, aciklama: 'Sonra gelen 1.200.000 TL için %14' },
        { limit: 1200000, oran: 0.13, aciklama: 'Sonra gelen 1.200.000 TL için %13' },
        { limit: 1800000, oran: 0.11, aciklama: 'Sonra gelen 1.800.000 TL için %11' },
        { limit: 2400000, oran: 0.08, aciklama: 'Sonra gelen 2.400.000 TL için %8' },
        { limit: 3000000, oran: 0.05, aciklama: 'Sonra gelen 3.000.000 TL için %5' },
        { limit: 3600000, oran: 0.03, aciklama: 'Sonra gelen 3.600.000 TL için %3' },
        { limit: Infinity, oran: 0.01, aciklama: '14.400.000 TL üzeri için %1' }
    ],

    // Maktu ücretler - Hukuk Mahkemeleri
    hukukMahkemeleri: {
        'asliye-hukuk': { ad: 'Asliye Hukuk Mahkemesi', ucret: 45000 },
        'sulh-hukuk': { ad: 'Sulh Hukuk Mahkemesi', ucret: 30000 },
        'asliye-ticaret': { ad: 'Asliye Ticaret Mahkemesi', ucret: 45000 },
        'tuketici': { ad: 'Tüketici Mahkemesi', ucret: 22500 },
        'is-mahkemesi': { ad: 'İş Mahkemesi', ucret: 45000 },
        'aile-mahkemesi': { ad: 'Aile Mahkemesi', ucret: 45000 },
        'fikri-sinai': { ad: 'Fikri ve Sınai Haklar Mahkemesi', ucret: 55000 },
        'kadastro': { ad: 'Kadastro Mahkemesi', ucret: 45000 }
    },

    // Maktu ücretler - Ceza Mahkemeleri
    cezaMahkemeleri: {
        'agir-ceza': { ad: 'Ağır Ceza Mahkemesi', ucret: 65000 },
        'asliye-ceza': { ad: 'Asliye Ceza Mahkemesi', ucret: 40000 },
        'cocuk-mahkemesi': { ad: 'Çocuk Mahkemesi', ucret: 40000 },
        'cocuk-agir-ceza': { ad: 'Çocuk Ağır Ceza Mahkemesi', ucret: 65000 },
        'sulh-ceza-hakim': { ad: 'Sulh Ceza Hakimliği', ucret: 20000 }
    },

    // Maktu ücretler - İdari Yargı
    idariYargi: {
        'idare-durusmasiz': { ad: 'İdare Mahkemesi (Duruşmasız)', ucret: 30000 },
        'idare-durusmali': { ad: 'İdare Mahkemesi (Duruşmalı)', ucret: 45000 },
        'vergi-durusmasiz': { ad: 'Vergi Mahkemesi (Duruşmasız)', ucret: 30000 },
        'vergi-durusmali': { ad: 'Vergi Mahkemesi (Duruşmalı)', ucret: 45000 },
        'danistay': { ad: 'Danıştay', ucret: 65000 }
    },

    // Maktu ücretler - İcra Takipleri
    icraTakipleri: {
        'genel-icra': { ad: 'Genel İcra Takibi', ucret: 9000 },
        'tahliye-icra': { ad: 'Tahliye İcra Takibi', ucret: 20000 },
        'ihtiyati-haciz': { ad: 'İhtiyati Haciz', ucret: 12000 },
        'iflas-takibi': { ad: 'İflas Takibi', ucret: 30000 }
    },

    // Maktu ücretler - Danışmanlık ve Belge Hazırlama
    danismanlik: {
        'sozlu-buro': { ad: 'Sözlü Danışma (Büro, ilk saat)', ucret: 4000 },
        'sozlu-buro-ek': { ad: 'Sözlü Danışma (Her ek saat)', ucret: 1800 },
        'sozlu-disari': { ad: 'Çağrı Üzerine Danışma (ilk saat)', ucret: 7000 },
        'sozlu-disari-ek': { ad: 'Çağrı Üzerine Danışma (Her ek saat)', ucret: 3500 },
        'yazili-danisma': { ad: 'Yazılı Danışma (ilk saat)', ucret: 7000 },
        'dilekce-ihtarname': { ad: 'Dilekçe/İhtarname/Protesto', ucret: 6000 },
        'kira-sozlesmesi': { ad: 'Kira Sözleşmesi', ucret: 8000 },
        'sirket-sozlesmesi': { ad: 'Şirket Ana Sözleşmesi', ucret: 21000 },
        'miras-vasiyetname': { ad: 'Miras Sözleşmesi/Vasiyetname', ucret: 32000 },
        'tuzuk-yonetmelik': { ad: 'Tüzük/Yönetmelik', ucret: 32000 }
    },

    // Zorunlu Avukat Ücretleri
    zorunluAvukat: {
        'yapi-kooperatifi': { ad: 'Yapı Kooperatifi (Aylık)', ucret: 27000 },
        'anonim-sirket': { ad: 'Anonim Şirket (Aylık)', ucret: 45000 }
    }
};

// Vekalet Ücreti Hesaplama Servisi
const VekaletService = {
    /**
     * Nispi vekalet ücreti hesapla
     * @param {number} davaDegeri - Dava değeri (TL)
     * @returns {Object} - Hesaplama sonucu ve detayları
     */
    hesaplaNispiUcret: (davaDegeri) => {
        if (davaDegeri <= 0) {
            return { ucret: 0, detaylar: [], davaDegeri: 0 };
        }

        let kalanDeger = davaDegeri;
        let toplamUcret = 0;
        const detaylar = [];
        let oncekiToplam = 0;

        for (const dilim of AAUT.nispiDilimler) {
            if (kalanDeger <= 0) break;

            const dilimDegeri = Math.min(kalanDeger, dilim.limit);
            const dilimUcreti = dilimDegeri * dilim.oran;

            if (dilimDegeri > 0) {
                detaylar.push({
                    aralik: dilim.limit === Infinity
                        ? `${Utils.formatCurrency(oncekiToplam)} üzeri`
                        : `${Utils.formatCurrency(oncekiToplam)} - ${Utils.formatCurrency(oncekiToplam + dilim.limit)}`,
                    deger: dilimDegeri,
                    oran: dilim.oran * 100,
                    ucret: dilimUcreti,
                    aciklama: dilim.aciklama
                });

                toplamUcret += dilimUcreti;
            }

            kalanDeger -= dilimDegeri;
            oncekiToplam += dilim.limit === Infinity ? 0 : dilim.limit;
        }

        return {
            ucret: toplamUcret,
            detaylar: detaylar,
            davaDegeri: davaDegeri
        };
    },

    /**
     * Maktu vekalet ücreti getir
     * @param {string} kategori - Kategori (hukukMahkemeleri, cezaMahkemeleri, vb.)
     * @param {string} tur - Alt tür kodu
     * @returns {Object} - Ücret bilgisi
     */
    getMaktuUcret: (kategori, tur) => {
        const kategoriler = {
            'hukuk': AAUT.hukukMahkemeleri,
            'ceza': AAUT.cezaMahkemeleri,
            'idari': AAUT.idariYargi,
            'icra': AAUT.icraTakipleri,
            'danismanlik': AAUT.danismanlik,
            'zorunlu': AAUT.zorunluAvukat
        };

        const kategoriData = kategoriler[kategori];
        if (!kategoriData || !kategoriData[tur]) {
            return null;
        }

        return {
            ...kategoriData[tur],
            kategori: kategori
        };
    },

    /**
     * Kategori listesini getir
     * @returns {Array} - Kategori listesi
     */
    getKategoriler: () => {
        return [
            { kod: 'hukuk', ad: 'Hukuk Mahkemeleri' },
            { kod: 'ceza', ad: 'Ceza Mahkemeleri' },
            { kod: 'idari', ad: 'İdari Yargı' },
            { kod: 'icra', ad: 'İcra Takipleri' },
            { kod: 'danismanlik', ad: 'Danışmanlık ve Belgeler' },
            { kod: 'zorunlu', ad: 'Zorunlu Avukat Ücretleri' }
        ];
    },

    /**
     * Kategoriye göre alt türleri getir
     * @param {string} kategori - Kategori kodu
     * @returns {Array} - Alt tür listesi
     */
    getAltTurler: (kategori) => {
        const kategoriler = {
            'hukuk': AAUT.hukukMahkemeleri,
            'ceza': AAUT.cezaMahkemeleri,
            'idari': AAUT.idariYargi,
            'icra': AAUT.icraTakipleri,
            'danismanlik': AAUT.danismanlik,
            'zorunlu': AAUT.zorunluAvukat
        };

        const kategoriData = kategoriler[kategori];
        if (!kategoriData) return [];

        return Object.entries(kategoriData).map(([kod, veri]) => ({
            kod: kod,
            ad: veri.ad,
            ucret: veri.ucret
        }));
    },

    /**
     * AAÜT bilgilerini getir
     * @returns {Object} - Tarife bilgileri
     */
    getTarifeBilgisi: () => {
        return {
            yil: AAUT.yil,
            yururlukTarihi: AAUT.yururlukTarihi
        };
    }
};

// Vekalet hesaplama UI kontrolü
document.addEventListener('DOMContentLoaded', function () {
    // Vekalet tab elementi var mı kontrol et
    const vekaletContent = document.getElementById('vekalet-content');
    if (!vekaletContent) return;

    // Form elementleri
    const hesaplamaTuru = document.getElementById('hesaplama-turu');
    const maktuSecimAlani = document.getElementById('maktu-secim-alani');
    const nispiSecimAlani = document.getElementById('nispi-secim-alani');
    const kategoriSelect = document.getElementById('vekalet-kategori');
    const altTurSelect = document.getElementById('vekalet-alt-tur');
    const davaDegeriInput = document.getElementById('dava-degeri');
    const vekaletForm = document.getElementById('vekalet-form');
    const vekaletResult = document.getElementById('vekalet-result');
    const vekaletHistory = document.getElementById('vekalet-history');

    // Input maskeleme
    if (davaDegeriInput) {
        InputMask.attach(davaDegeriInput);
    }

    // Hesaplama geçmişi
    let vekaletHistoryData = JSON.parse(localStorage.getItem('vekaletHistory')) || [];

    // Hesaplama türü değiştiğinde
    if (hesaplamaTuru) {
        hesaplamaTuru.addEventListener('change', function () {
            const tur = this.value;
            if (tur === 'nispi') {
                maktuSecimAlani.style.display = 'none';
                nispiSecimAlani.style.display = 'block';
            } else {
                maktuSecimAlani.style.display = 'block';
                nispiSecimAlani.style.display = 'none';
            }
        });
    }

    // Kategori değiştiğinde alt türleri güncelle
    if (kategoriSelect) {
        // Kategorileri doldur
        VekaletService.getKategoriler().forEach(kat => {
            const option = document.createElement('option');
            option.value = kat.kod;
            option.textContent = kat.ad;
            kategoriSelect.appendChild(option);
        });

        kategoriSelect.addEventListener('change', function () {
            const kategori = this.value;
            altTurSelect.innerHTML = '<option value="">Alt Tür Seçiniz</option>';

            if (kategori) {
                VekaletService.getAltTurler(kategori).forEach(tur => {
                    const option = document.createElement('option');
                    option.value = tur.kod;
                    option.textContent = `${tur.ad} - ${Utils.formatCurrency(tur.ucret)}`;
                    altTurSelect.appendChild(option);
                });
            }
        });
    }

    // Form submit
    if (vekaletForm) {
        vekaletForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const tur = hesaplamaTuru.value;
            let sonuc;

            if (tur === 'nispi') {
                // Nispi ücret hesaplama
                const davaDegeri = Utils.parseCurrency(davaDegeriInput.value);
                if (davaDegeri <= 0) {
                    alert('Lütfen geçerli bir dava değeri giriniz.');
                    return;
                }

                sonuc = VekaletService.hesaplaNispiUcret(davaDegeri);
                gosterNispiSonuc(sonuc);

                // Geçmişe ekle
                const hesaplama = {
                    tarih: new Date().toLocaleString('tr-TR'),
                    tur: 'Nispi Ücret',
                    davaDegeri: davaDegeri,
                    ucret: sonuc.ucret
                };
                vekaletHistoryData.unshift(hesaplama);

            } else {
                // Maktu ücret hesaplama
                const kategori = kategoriSelect.value;
                const altTur = altTurSelect.value;

                if (!kategori || !altTur) {
                    alert('Lütfen kategori ve tür seçiniz.');
                    return;
                }

                sonuc = VekaletService.getMaktuUcret(kategori, altTur);
                if (!sonuc) {
                    alert('Ücret bilgisi bulunamadı.');
                    return;
                }

                gosterMaktuSonuc(sonuc);

                // Geçmişe ekle
                const hesaplama = {
                    tarih: new Date().toLocaleString('tr-TR'),
                    tur: 'Maktu Ücret',
                    kategoriAd: sonuc.ad,
                    ucret: sonuc.ucret
                };
                vekaletHistoryData.unshift(hesaplama);
            }

            // Geçmişi kaydet
            if (vekaletHistoryData.length > 10) {
                vekaletHistoryData.pop();
            }
            localStorage.setItem('vekaletHistory', JSON.stringify(vekaletHistoryData));
            updateVekaletHistory();
        });
    }

    // Nispi sonuç göster
    function gosterNispiSonuc(sonuc) {
        let detayHtml = '';
        sonuc.detaylar.forEach(d => {
            detayHtml += `
                <div class="result-item">
                    <span>${d.aciklama}</span>
                    <span>${Utils.formatCurrency(d.ucret)}</span>
                </div>
            `;
        });

        document.getElementById('vekalet-sonuc-icerik').innerHTML = `
            <div class="result-item">
                <span>Dava Değeri:</span>
                <span>${Utils.formatCurrency(sonuc.davaDegeri)}</span>
            </div>
            <h4 style="margin: 15px 0 10px 0; color: #666;">Dilim Detayları</h4>
            ${detayHtml}
            <div class="result-item" style="margin-top: 15px; font-size: 18px;">
                <span><strong>Asgari Vekalet Ücreti:</strong></span>
                <span style="color: #059669;"><strong>${Utils.formatCurrency(sonuc.ucret)}</strong></span>
            </div>
            <div class="result-item">
                <span>KDV Dahil (%20):</span>
                <span>${Utils.formatCurrency(sonuc.ucret * 1.20)}</span>
            </div>
        `;
        vekaletResult.style.display = 'block';
    }

    // Maktu sonuç göster
    function gosterMaktuSonuc(sonuc) {
        document.getElementById('vekalet-sonuc-icerik').innerHTML = `
            <div class="result-item">
                <span>Hizmet Türü:</span>
                <span>${sonuc.ad}</span>
            </div>
            <div class="result-item" style="font-size: 18px;">
                <span><strong>Asgari Vekalet Ücreti:</strong></span>
                <span style="color: #059669;"><strong>${Utils.formatCurrency(sonuc.ucret)}</strong></span>
            </div>
            <div class="result-item">
                <span>KDV Dahil (%20):</span>
                <span>${Utils.formatCurrency(sonuc.ucret * 1.20)}</span>
            </div>
        `;
        vekaletResult.style.display = 'block';
    }

    // Geçmiş güncelle
    function updateVekaletHistory() {
        if (!vekaletHistory) return;

        if (vekaletHistoryData.length === 0) {
            vekaletHistory.innerHTML = '<p>Henüz hesaplama yapılmadı.</p>';
            return;
        }

        let html = '';
        vekaletHistoryData.forEach((item, index) => {
            const aciklama = item.tur === 'Nispi Ücret'
                ? `Dava Değeri: ${Utils.formatCurrency(item.davaDegeri)}`
                : item.kategoriAd;

            html += `
                <div class="history-item" data-index="${index}">
                    <div class="history-date">${item.tarih}</div>
                    <div>${item.tur}: ${aciklama} | Ücret: ${Utils.formatCurrency(item.ucret)}</div>
                </div>
            `;
        });

        vekaletHistory.innerHTML = html;
    }

    // Sayfa yüklendiğinde geçmişi göster
    updateVekaletHistory();

    // Tarife bilgisini göster
    const tarifeBilgisi = VekaletService.getTarifeBilgisi();
    const tarifeBilgiEl = document.getElementById('tarife-bilgisi');
    if (tarifeBilgiEl) {
        tarifeBilgiEl.textContent = `AAÜT ${tarifeBilgisi.yil} (Yürürlük: ${tarifeBilgisi.yururlukTarihi})`;
    }
});
