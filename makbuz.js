// Serbest Meslek Makbuzu Hesaplama Aracı - JavaScript Kodu
document.addEventListener('DOMContentLoaded', function () {
    // Tutar input alanına otomatik formatlama ekle
    const tutarInput = document.getElementById('tutar');

    // Utils ile input maskeleme
    InputMask.attach(tutarInput);

    // Tab değiştirme işlevselliği
    const tabMakbuz = document.getElementById('tab-makbuz');
    const tabFaiz = document.getElementById('tab-faiz');
    const tabVekalet = document.getElementById('tab-vekalet');
    const makbuzContent = document.getElementById('makbuz-content');
    const faizContent = document.getElementById('faiz-content');
    const vekaletContent = document.getElementById('vekalet-content');

    // Tüm tabları ve içerikleri gizle fonksiyonu
    function hideAllTabs() {
        tabMakbuz.classList.remove('active');
        tabFaiz.classList.remove('active');
        if (tabVekalet) tabVekalet.classList.remove('active');
        makbuzContent.style.display = 'none';
        faizContent.style.display = 'none';
        if (vekaletContent) vekaletContent.style.display = 'none';
    }

    tabMakbuz.addEventListener('click', function () {
        hideAllTabs();
        tabMakbuz.classList.add('active');
        makbuzContent.style.display = 'block';
    });

    tabFaiz.addEventListener('click', function () {
        hideAllTabs();
        tabFaiz.classList.add('active');
        faizContent.style.display = 'block';
    });

    if (tabVekalet) {
        tabVekalet.addEventListener('click', function () {
            hideAllTabs();
            tabVekalet.classList.add('active');
            vekaletContent.style.display = 'block';
        });
    }

    // Makbuz hesaplama formu
    const makbuzForm = document.getElementById('makbuz-form');
    const makbuzResult = document.getElementById('makbuz-result');
    const makbuzHistory = document.getElementById('makbuz-history');

    // Makbuz hesaplama geçmişi
    let makbuzHistoryData = JSON.parse(localStorage.getItem('makbuzHistory')) || [];

    // Makbuz hesaplama işlevi
    makbuzForm.addEventListener('submit', function (e) {
        e.preventDefault();

        try {
            // Form değerlerini al
            const kdvDahilToplam = Utils.parseCurrency(tutarInput.value);

            if (isNaN(kdvDahilToplam) || kdvDahilToplam <= 0) {
                alert('Lütfen geçerli bir tutar giriniz.');
                return;
            }

            const kdvOrani = parseFloat(document.getElementById('kdv-orani').value);
            const stopajOrani = parseFloat(document.getElementById('stopaj-orani').value);
            const tevkifatSecim = document.getElementById('tevkifat').value;

            // KDV ve stopaj dahil toplam tutardan brüt tutarı hesapla
            // Formül: Brüt = Toplam / (1 + KDV Oranı)
            const brutTutar = kdvDahilToplam / (1 + kdvOrani);
            const kdvTutari = kdvDahilToplam - brutTutar;

            // Tevkifat hesapla
            let tevkifatOrani = 0;
            if (tevkifatSecim === 'evet') {
                tevkifatOrani = 0.5; // 5/10
            } else if (tevkifatSecim === 'otomatik' && kdvDahilToplam >= 12000) {
                tevkifatOrani = 0.5; // 5/10
            }

            const tevkifatTutari = kdvTutari * tevkifatOrani;
            const tahsilEdilecekKDV = kdvTutari - tevkifatTutari;

            // Stopaj hesapla
            const stopajTutari = brutTutar * stopajOrani;

            // Net tahsilat hesapla
            const netTahsilat = brutTutar + tahsilEdilecekKDV - stopajTutari;

            // Sonuçları göster
            document.getElementById('result-brut').textContent = Utils.formatCurrency(brutTutar);
            document.getElementById('result-kdv').textContent = Utils.formatCurrency(kdvTutari);
            document.getElementById('result-tevkifat').textContent = Utils.formatCurrency(tevkifatTutari);
            document.getElementById('result-tahsil-kdv').textContent = Utils.formatCurrency(tahsilEdilecekKDV);
            document.getElementById('result-stopaj').textContent = Utils.formatCurrency(stopajTutari);
            document.getElementById('result-toplam').textContent = Utils.formatCurrency(kdvDahilToplam);
            document.getElementById('result-net').textContent = Utils.formatCurrency(netTahsilat);

            makbuzResult.style.display = 'block';

            // Hesaplama geçmişine ekle
            const hesaplama = {
                tarih: new Date().toLocaleString('tr-TR'),
                kdvDahilToplam: kdvDahilToplam,
                brutTutar: brutTutar,
                kdvOrani: kdvOrani * 100,
                stopajOrani: stopajOrani * 100,
                tevkifat: tevkifatOrani > 0 ? 'Evet' : 'Hayır',
                netTahsilat: netTahsilat
            };

            makbuzHistoryData.unshift(hesaplama);
            if (makbuzHistoryData.length > 10) {
                makbuzHistoryData.pop();
            }

            localStorage.setItem('makbuzHistory', JSON.stringify(makbuzHistoryData));
            updateMakbuzHistory();
        } catch (error) {
            console.error('Hesaplama hatası:', error);
            alert('Hesaplama sırasında bir hata oluştu. Lütfen girdiğiniz değerleri kontrol ediniz.');
        }
    });

    // Makbuz geçmişini güncelle
    function updateMakbuzHistory() {
        if (makbuzHistoryData.length === 0) {
            makbuzHistory.innerHTML = '<p>Henüz hesaplama yapılmadı.</p>';
            return;
        }

        let html = '';
        makbuzHistoryData.forEach((item, index) => {
            html += `
                <div class="history-item" data-index="${index}">
                    <div class="history-date">${item.tarih}</div>
                    <div>Toplam: ${Utils.formatCurrency(item.kdvDahilToplam)} | KDV: %${item.kdvOrani} | Net: ${Utils.formatCurrency(item.netTahsilat)}</div>
                </div>
            `;
        });

        makbuzHistory.innerHTML = html;

        // Geçmiş öğelerine tıklama olayı ekle
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                const hesaplama = makbuzHistoryData[index];

                // Formatlı değeri manuel olarak oluştur
                const formattedValue = Utils.formatNumber(hesaplama.kdvDahilToplam);
                tutarInput.value = formattedValue;

                document.getElementById('kdv-orani').value = hesaplama.kdvOrani / 100;
                document.getElementById('stopaj-orani').value = hesaplama.stopajOrani / 100;
                document.getElementById('tevkifat').value = hesaplama.tevkifat === 'Evet' ? 'evet' : 'hayir';

                // Formu otomatik gönder
                makbuzForm.dispatchEvent(new Event('submit'));
            });
        });
    }

    // Sayfa yüklendiğinde geçmişi göster
    updateMakbuzHistory();
});
