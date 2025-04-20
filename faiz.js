// Faiz Hesaplama Aracı - JavaScript Kodu

document.addEventListener('DOMContentLoaded', function() {
    // Faiz hesaplama formu
    const faizForm = document.getElementById('faiz-form');
    const faizResult = document.getElementById('faiz-result');
    const faizHistory = document.getElementById('faiz-history');

    // Faiz hesaplama geçmişi
    let faizHistoryData = JSON.parse(localStorage.getItem('faizHistory')) || [];

    // Faiz hesaplama işlevi
    faizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form değerlerini al
        const anapara = parseFloat(document.getElementById('anapara').value);
        const faizOrani = parseFloat(document.getElementById('faiz-orani').value);
        const faizTuru = document.getElementById('faiz-turu').value;
        const baslangicTarihi = new Date(document.getElementById('baslangic-tarihi').value);
        const bitisTarihi = new Date(document.getElementById('bitis-tarihi').value);
        
        // Gün farkını hesapla
        const gunFarki = Math.floor((bitisTarihi - baslangicTarihi) / (1000 * 60 * 60 * 24));
        
        if (gunFarki < 0) {
            alert('Bitiş tarihi başlangıç tarihinden önce olamaz!');
            return;
        }
        
        // Faiz tutarını hesapla
        const faizTutari = anapara * (faizOrani / 100) * (gunFarki / 365);
        const toplamTutar = anapara + faizTutari;
        
        // Sonuçları göster
        document.getElementById('result-anapara').textContent = formatCurrency(anapara);
        document.getElementById('result-oran').textContent = `%${faizOrani.toFixed(2)}`;
        document.getElementById('result-gun').textContent = gunFarki;
        document.getElementById('result-faiz').textContent = formatCurrency(faizTutari);
        document.getElementById('result-faiz-toplam').textContent = formatCurrency(toplamTutar);
        
        faizResult.style.display = 'block';
        
        // Hesaplama geçmişine ekle
        const hesaplama = {
            tarih: new Date().toLocaleString('tr-TR'),
            anapara: anapara,
            faizOrani: faizOrani,
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
                    <div class="history-date">${item.tarih}</div>
                    <div>Anapara: ${formatCurrency(item.anapara)} | Faiz: %${item.faizOrani} | Toplam: ${formatCurrency(item.toplamTutar)}</div>
                </div>
            `;
        });
        
        faizHistory.innerHTML = html;
        
        // Geçmiş öğelerine tıklama olayı ekle
        document.querySelectorAll('#faiz-history .history-item').forEach(item => {
            item.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const hesaplama = faizHistoryData[index];
                
                document.getElementById('anapara').value = hesaplama.anapara;
                document.getElementById('faiz-orani').value = hesaplama.faizOrani;
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

    // Para formatı
    function formatCurrency(amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    }

    // Bugünün tarihini varsayılan olarak ayarla
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    document.getElementById('baslangic-tarihi').value = todayFormatted;
    document.getElementById('bitis-tarihi').value = todayFormatted;
});
