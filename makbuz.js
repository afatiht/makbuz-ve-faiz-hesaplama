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
  
  // Serbest Meslek Makbuzu Hesaplama Aracı - JavaScript Kodu
  document.addEventListener('DOMContentLoaded', function() {
      // Tutar input alanına otomatik formatlama ekle
      const tutarInput = document.getElementById('tutar');
      
      // Input olayını dinle
      tutarInput.addEventListener('input', function(e) {
          // Cursor pozisyonunu kaydet
          const cursorPos = this.selectionStart;
          const originalLength = this.value.length;
          
          formatCurrencyInput(this);
          
          // Cursor pozisyonunu ayarla
          const newLength = this.value.length;
          const posDiff = newLength - originalLength;
          this.setSelectionRange(cursorPos + posDiff, cursorPos + posDiff);
      });
      
      // Virgül tuşuna özel işlem
      tutarInput.addEventListener('keydown', function(e) {
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
      
      // Formatlı değeri parse etme fonksiyonu
      function parseFormattedNumber(value) {
          if (!value) return 0;
          // Binlik ayraçlarını (nokta) kaldır ve virgülü noktaya çevir
          return parseFloat(value.replace(/\./g, '').replace(',', '.'));
      }
      
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
          
          try {
              // Form değerlerini al
              const kdvDahilToplam = parseFormattedNumber(tutarInput.value);
              
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
                  
                  // Formatlı değeri manuel olarak oluştur
                  const formattedValue = formatManualCurrency(hesaplama.kdvDahilToplam);
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
  });
  