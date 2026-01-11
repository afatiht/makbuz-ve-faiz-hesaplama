// Faiz Hesaplama Aracı - JavaScript Kodu
document.addEventListener('DOMContentLoaded', function () {
    // Input alanlarına otomatik formatlama ekle
    const anaparaInput = document.getElementById('anapara');
    const faizOraniInput = document.getElementById('faiz-orani');

    // Utils ile input maskeleme
    InputMask.attach(anaparaInput);
    // Faiz oranı için de aynı maskeleme kullanılabilir (virgüllü sayı)
    InputMask.attach(faizOraniInput, { type: 'number' });

    // Faiz hesaplama formu
    const faizForm = document.getElementById('faiz-form');
    const faizResult = document.getElementById('faiz-result');
    const faizHistory = document.getElementById('faiz-history');

    // Faiz hesaplama geçmişi
    let faizHistoryData = JSON.parse(localStorage.getItem('faizHistory')) || [];

    // Faiz hesaplama işlevi
    faizForm.addEventListener('submit', function (e) {
        e.preventDefault();

        try {
            // Form değerlerini al
            const anapara = Utils.parseCurrency(anaparaInput.value);
            let faizOrani = Utils.parseCurrency(faizOraniInput.value);
            const faizTuru = document.getElementById('faiz-turu').value;
            const baslangicTarihi = new Date(document.getElementById('baslangic-tarihi').value);
            const bitisTarihi = new Date(document.getElementById('bitis-tarihi').value);

            // Gün farkını hesapla
            const gunFarki = DateUtils.calculateDayDifference(baslangicTarihi, bitisTarihi);

            if (bitisTarihi < baslangicTarihi) {
                alert('Bitiş tarihi başlangıç tarihinden önce olamaz!');
                return;
            }

            // Faiz türüne göre hesaplama
            let faizTutari;
            let kullanilacakOran = faizOrani;

            if (faizTuru === 'temerrut') {
                // Temerrüt faizi: Ticari işlerde avans faiz oranı uygulanır
                // Eğer kullanıcı oran girmediyse veya düşük girdiyse varsayılan avans faizi kullan
                // Güncel avans faizi oranı (2024-2025): %55
                const VARSAYILAN_TEMERRUT_ORANI = 55; // Avans faiz oranı

                if (faizOrani === 0) {
                    kullanilacakOran = VARSAYILAN_TEMERRUT_ORANI;
                    faizOraniInput.value = Utils.formatNumber(VARSAYILAN_TEMERRUT_ORANI);
                }

                // Temerrüt faizi formülü (basit faiz ile aynı formül, fark oran seçiminde)
                faizTutari = anapara * (kullanilacakOran / 100) * (gunFarki / 365);
            } else {
                // Basit faiz hesaplama
                // Formül: Faiz = Anapara × (Oran / 100) × (Gün / 365)
                faizTutari = anapara * (faizOrani / 100) * (gunFarki / 365);
                kullanilacakOran = faizOrani;
            }

            const toplamTutar = anapara + faizTutari;

            // Sonuçları göster ve kopyalama butonlarını ekle
            const results = [
                { id: 'result-anapara', value: anapara, type: 'currency' },
                { id: 'result-oran', value: `%${kullanilacakOran.toFixed(2)}`, type: 'text' },
                { id: 'result-gun', value: gunFarki, type: 'text' },
                { id: 'result-faiz', value: faizTutari, type: 'currency' },
                { id: 'result-faiz-toplam', value: toplamTutar, type: 'currency' }
            ];

            results.forEach(res => {
                const el = document.getElementById(res.id);
                el.textContent = res.type === 'currency' ? Utils.formatCurrency(res.value) : res.value;

                // Sadece para birimi olanlara kopyalama butonu ekle
                if (res.type === 'currency') {
                    // Konteyner div oluştur/bul
                    let container = el.parentNode.querySelector('div.result-value-container');
                    if (!container) {
                        container = document.createElement('div');
                        container.className = 'result-value-container';
                        // Değeri konteynere taşı
                        el.parentNode.appendChild(container);
                        container.appendChild(el);
                    }

                    let copyBtn = container.querySelector('.copy-btn');
                    if (!copyBtn) {
                        copyBtn = document.createElement('button');
                        copyBtn.className = 'copy-btn';
                        copyBtn.textContent = 'Kopyala';
                        container.appendChild(copyBtn);
                    }

                    const newBtn = copyBtn.cloneNode(true);
                    copyBtn.parentNode.replaceChild(newBtn, copyBtn);
                    newBtn.addEventListener('click', () => {
                        Utils.handleCopyClick(newBtn, Utils.formatNumber(res.value));
                    });
                }
            });

            faizResult.style.display = 'block';

            // Hesaplama geçmişine ekle
            const hesaplama = {
                tarih: new Date().toLocaleString('tr-TR'),
                anapara: anapara,
                faizOrani: kullanilacakOran,
                faizTuru: faizTuru === 'basit' ? 'Basit Faiz' : 'Temerrüt Faizi',
                baslangicTarihi: baslangicTarihi.toLocaleDateString('tr-TR'),
                bitisTarihi: bitisTarihi.toLocaleDateString('tr-TR'),
                gunFarki: gunFarki,
                faizTutari: faizTutari,
                toplamTutar: toplamTutar
            };

            faizHistoryData.unshift(hesaplama);
            if (faizHistoryData.length > 10) {
                faizHistoryData.pop();
            }

            localStorage.setItem('faizHistory', JSON.stringify(faizHistoryData));
            updateFaizHistory();
        } catch (error) {
            console.error('Hesaplama hatası:', error);
            alert('Hesaplama sırasında bir hata oluştu. Lütfen girdiğiniz değerleri kontrol ediniz.');
        }
    });

    // Faiz geçmişini güncelle
    function updateFaizHistory() {
        if (faizHistoryData.length === 0) {
            faizHistory.innerHTML = '<p>Henüz hesaplama yapılmadı.</p>';
            return;
        }

        let html = '';
        faizHistoryData.forEach((item, index) => {
            html += `
                <div class="history-item" data-index="${index}">
                    <div class="history-date">${Utils.escapeHTML(item.tarih)}</div>
                    <div>Anapara: ${Utils.escapeHTML(Utils.formatCurrency(item.anapara))} | Faiz: %${Utils.escapeHTML(item.faizOrani.toFixed(2))} | Toplam: ${Utils.escapeHTML(Utils.formatCurrency(item.toplamTutar))}</div>
                </div>
            `;
        });

        faizHistory.innerHTML = html;

        // Geçmiş öğelerine tıklama olayı ekle
        document.querySelectorAll('#faiz-history .history-item').forEach(item => {
            item.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                const hesaplama = faizHistoryData[index];

                // Form alanlarını doldur
                anaparaInput.value = Utils.formatNumber(hesaplama.anapara);
                faizOraniInput.value = Utils.formatNumber(hesaplama.faizOrani);
                document.getElementById('faiz-turu').value = hesaplama.faizTuru === 'Basit Faiz' ? 'basit' : 'temerrut';

                // Tarihleri ayarla (YYYY-MM-DD formatına dönüştür)
                const baslangicArr = hesaplama.baslangicTarihi.split('.');
                const bitisArr = hesaplama.bitisTarihi.split('.');

                if (baslangicArr.length === 3 && bitisArr.length === 3) {
                    const baslangicFormatted = `${baslangicArr[2]}-${baslangicArr[1].padStart(2, '0')}-${baslangicArr[0].padStart(2, '0')}`;
                    const bitisFormatted = `${bitisArr[2]}-${bitisArr[1].padStart(2, '0')}-${bitisArr[0].padStart(2, '0')}`;

                    document.getElementById('baslangic-tarihi').value = baslangicFormatted;
                    document.getElementById('bitis-tarihi').value = bitisFormatted;
                }

                // Formu otomatik gönder
                faizForm.dispatchEvent(new Event('submit'));
            });
        });
    }

    // Sayfa yüklendiğinde geçmişi göster
    updateFaizHistory();

    // Bugünün tarihini varsayılan olarak ayarla
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    document.getElementById('baslangic-tarihi').value = todayFormatted;
    document.getElementById('bitis-tarihi').value = todayFormatted;

    // TCMB Integration
    const getRatesBtn = document.getElementById('get-rates-btn');
    const ratesModal = document.getElementById('rates-modal');
    const closeRates = document.getElementById('close-rates');
    const ratesList = document.getElementById('rates-list');

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target == ratesModal) {
            ratesModal.style.display = 'none';
        }
    });

    // Get Rates
    getRatesBtn.addEventListener('click', async () => {
        // Key is now hardcoded in service, no need to check here
        ratesModal.style.display = 'block';
        ratesList.innerHTML = `
            <div class="spinner"></div>
            <p class="loading-text">Veriler çekiliyor, lütfen bekleyiniz...</p>
        `;

        try {
            const rates = await TCMBService.getCommonRates();

            if (rates.length === 0) {
                ratesList.innerHTML = '<p>Güncel faiz oranı bulunamadı.</p>';
                return;
            }

            let html = '';
            rates.forEach(rate => {
                html += `
                    <div class="rate-list-item" data-value="${rate.value}">
                        <span>${rate.name}</span>
                        <span>%${rate.value} (${rate.date})</span>
                    </div>
                `;
            });
            ratesList.innerHTML = html;

            // Add click listeners to items
            document.querySelectorAll('.rate-list-item').forEach(item => {
                item.addEventListener('click', function () {
                    const value = this.getAttribute('data-value');
                    faizOraniInput.value = value;
                    // Trigger input mask update if needed
                    faizOraniInput.dispatchEvent(new Event('input'));
                    ratesModal.style.display = 'none';
                });
            });

        } catch (error) {
            console.error(error);
            ratesList.innerHTML = `<p style="color: red;">Hata oluştu: ${error.message}</p>`;
        }
    });

    closeRates.addEventListener('click', () => {
        ratesModal.style.display = 'none';
    });
});
