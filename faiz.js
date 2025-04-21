// Otomatik formatlama için input mask fonksiyonu
function formatCurrencyInput(input) {
    // Mevcut değeri al
    let value = input.value;
    
    // Tüm nokta ve virgülleri geçici olarak kaldır
    value = value.replace(/[.,]/g, '');
    
    // Eğer değer boşsa, işlem yapma
    if (value === '') {
        input.value = '';
        return;
    }
    
    // Son iki karakteri kuruş olarak ayır (varsa)
    let wholePart = value;
    let decimalPart = '';
    
    // Eğer kullanıcı virgül girdiyse, sonrasını kuruş olarak işle
    const originalValue = input.value;
    if (originalValue.includes(',')) {
        const parts = originalValue.split(',');
        // Virgülden sonraki kısmı al (en fazla 2 karakter)
        if (parts.length > 1) {
            decimalPart = parts[1].substring(0, 2);
            // Virgülden önceki kısımdan tüm nokta ve virgülleri temizle
            wholePart = parts[0].replace(/[.,]/g, '');
        }
    }
    
    // Binlik ayraçları ekle (manuel olarak)
    let formattedWholePart = '';
    const wholePartStr = wholePart.toString();
    
    // Sondan başlayarak her 3 basamakta bir nokta ekle
    for (let i = wholePartStr.length - 1, j = 0; i >= 0; i--, j++) {
        if (j > 0 && j % 3 === 0) {
            formattedWholePart = '.' + formattedWholePart;
        }
        formattedWholePart = wholePartStr.charAt(i) + formattedWholePart;
    }
    
    // Sonucu birleştir
    if (originalValue.includes(',') || decimalPart) {
        input.value = formattedWholePart + ',' + decimalPart;
    } else {
        input.value = formattedWholePart;
    }
}

// Faiz Hesaplama Aracı - JavaScript Kodu
document.addEventListener('DOMContentLoaded', function() {
    // Input alanlarına otomatik formatlama ekle
    const anaparaInput = document.getElementById('anapara');
    const faizOraniInput = document.getElementById('faiz-orani');
    
    // Anapara input olayını dinle
    anaparaInput.addEventListener('input', function(e) {
        // Sadece sayı ve virgül girişine izin ver
        this.value = this.value.replace(/[^\d.,]/g, '');
        
        // Cursor pozisyonunu kaydet
        const cursorPos = this.selectionStart;
        const originalLength = this.value.length;
        
        formatCurrencyInput(this);
        
        // Cursor pozisyonunu ayarla
        const newLength = this.value.length;
        const posDiff = newLength - originalLength;
        this.setSelectionRange(cursorPos + posDiff, cursorPos + posDiff);
    });
    
    // Faiz oranı input olayını dinle
    faizOraniInput.addEventListener('input', function(e) {
        // Sadece sayı ve virgül girişine izin ver
        this.value = this.value.replace(/[^\d.,]/g, '');
        
        // Cursor pozisyonunu kaydet
        const cursorPos = this.selectionStart;
        const originalLength = this.value.length;
        
        // Virgül kontrolü
        if (this.value.includes(',')) {
            const parts = this.value.split(',');
            if (parts[1].length > 2) {
                parts[1] = parts[1].substring(0, 2);
                this.value = parts.join(',');
            }
        }
        
        // Cursor pozisyonunu ayarla
        const newLength = this.value.length;
        const posDiff = newLength - originalLength;
        this.setSelectionRange(cursorPos + posDiff, cursorPos + posDiff);
    });
    
    // Virgül tuşuna özel işlem
    [anaparaInput, faizOraniInput].forEach(input => {
        input.addEventListener('keydown', function(e) {
            // Virgül veya nokta tuşuna basıldığında
            if (e.key === ',' || e.key === '.') {
                e.preventDefault();
                
                // Eğer zaten virgül varsa, işlem yapma
                if (this.value.includes(',')) {
                    return;
                }
                
                // Virgül ekle
                this.value = this.value + ',';
            }
        });
    });
    
    // Formatlı değeri parse etme fonksiyonu
    function parseFormattedNumber(value) {
        if (!value) return 0;
        // Binlik ayraçlarını (nokta) kaldır ve virgülü noktaya çevir
        return parseFloat(value.replace(/\./g, '').replace(',', '.'));
    }
    
    // Faiz hesaplama formu
    const faizForm = document.getElementById('faiz-form');
    const faizResult = document.getElementById('faiz-result');
    const faizHistory = document.getElementById('faiz-history');
    
    // Faiz hesaplama geçmişi
    let faizHistoryData = JSON.parse(localStorage.getItem('faizHistory')) || [];
    
    // Faiz hesaplama işlevi
    faizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            // Form değerlerini al
            const anapara = parseFormattedNumber(anaparaInput.value);
            const faizOrani = parseFormattedNumber(faizOraniInput.value);
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
                    <div class="history-date">${item.tarih}</div>
                    <div>Anapara: ${formatCurrency(item.anapara)} | Faiz: %${item.faizOrani.toFixed(2)} | Toplam: ${formatCurrency(item.toplamTutar)}</div>
                </div>
            `;
        });
        
        faizHistory.innerHTML = html;
        
        // Geçmiş öğelerine tıklama olayı ekle
        document.querySelectorAll('#faiz-history .history-item').forEach(item => {
            item.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const hesaplama = faizHistoryData[index];
                
                // Form alanlarını doldur
                anaparaInput.value = formatManualCurrency(hesaplama.anapara);
                faizOraniInput.value = hesaplama.faizOrani.toFixed(2).replace('.', ',');
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
    
    // Para formatı (Intl.NumberFormat kullanmadan manuel formatlama)
    function formatCurrency(amount) {
        return formatManualCurrency(amount) + ' ₺';
    }
    
    // Manuel para formatı
    function formatManualCurrency(amount) {
        // Sayıyı string'e çevir ve noktadan ayır
        const parts = amount.toFixed(2).toString().split('.');
        const wholePart = parts[0];
        const decimalPart = parts[1];
        
        // Binlik ayraçları ekle
        let formattedWholePart = '';
        for (let i = wholePart.length - 1, j = 0; i >= 0; i--, j++) {
            if (j > 0 && j % 3 === 0) {
                formattedWholePart = '.' + formattedWholePart;
            }
            formattedWholePart = wholePart.charAt(i) + formattedWholePart;
        }
        
        // Ondalık kısmı virgülle birleştir
        return formattedWholePart + ',' + decimalPart;
    }
    
    // Bugünün tarihini varsayılan olarak ayarla
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    document.getElementById('baslangic-tarihi').value = todayFormatted;
    document.getElementById('bitis-tarihi').value = todayFormatted;
});
