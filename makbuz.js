// Serbest Meslek Makbuzu Hesaplama Aracı - JavaScript Kodu

document.addEventListener('DOMContentLoaded', function() {
    // Tab değiştirme işlevselliği
    const tabMakbuz = document.getElementById('tab-makbuz');
    const tabFaiz = document.getElementById('tab-faiz');
    const makbuzContent = document.getElementById('makbuz-content');
    const faizContent = document.getElementById('faiz-content');

    tabMakbuz.addEventListener('click', function() {
        tabMakbuz.classList.add('active');
        tabFaiz.classList.remove('active');
        makbuzContent.style.display = 'block';
        faizContent.style.display = 'none';
    });

    tabFaiz.addEventListener('click', function() {
        tabFaiz.classList.add('active');
        tabMakbuz.classList.remove('active');
        faizContent.style.display = 'block';
        makbuzContent.style.display = 'none';
    });

    // Makbuz hesaplama formu
    const makbuzForm = document.getElementById('makbuz-form');
    const makbuzResult = document.getElementById('makbuz-result');
    const makbuzHistory = document.getElementById('makbuz-history');

    // Makbuz hesaplama geçmişi
    let makbuzHistoryData = JSON.parse(localStorage.getItem('makbuzHistory')) || [];

    // Makbuz hesaplama işlevi
    makbuzForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form değerlerini al
        const kdvDahilToplam = parseFloat(document.getElementById('tutar').value);
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
        } else if (tevkifatSecim === 'otomatik' && kdvDahilToplam > 9900) {
            tevkifatOrani = 0.5; // 5/10
        }
        
        const tevkifatTutari = kdvTutari * tevkifatOrani;
        const tahsilEdilecekKDV = kdvTutari - tevkifatTutari;
        
        // Stopaj hesapla
        const stopajTutari = brutTutar * stopajOrani;
        
        // Net tahsilat hesapla
        const netTahsilat = brutTutar + tahsilEdilecekKDV - stopajTutari;
        
        // Sonuçları göster
        document.getElementById('result-brut').textContent = formatCurrency(brutTutar);
        document.getElementById('result-kdv').textContent = formatCurrency(kdvTutari);
        document.getElementById('result-tevkifat').textContent = formatCurrency(tevkifatTutari);
        document.getElementById('result-tahsil-kdv').textContent = formatCurrency(tahsilEdilecekKDV);
        document.getElementById('result-stopaj').textContent = formatCurrency(stopajTutari);
        document.getElementById('result-toplam').textContent = formatCurrency(kdvDahilToplam);
        document.getElementById('result-net').textContent = formatCurrency(netTahsilat);
        
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
                    <div>Toplam: ${formatCurrency(item.kdvDahilToplam)} | KDV: %${item.kdvOrani} | Net: ${formatCurrency(item.netTahsilat)}</div>
                </div>
            `;
        });
        
        makbuzHistory.innerHTML = html;
        
        // Geçmiş öğelerine tıklama olayı ekle
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const hesaplama = makbuzHistoryData[index];
                
                document.getElementById('tutar').value = hesaplama.kdvDahilToplam;
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

    // Para formatı
    function formatCurrency(amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    }
});
