// Serbest Meslek Makbuzu Hesaplama Aracı - JavaScript
document.addEventListener('DOMContentLoaded', function () {
    /* ---------- 1.  Para Girişi Otomatik Format ---------- */
    function formatCurrencyInput(input) {
      // ❶ Tüm ayraçları kaldır, ondalığı "." yap
      const numeric = input.value
        .replace(/\./g, '')      // binlikleri sil
        .replace(/,/g, '.');     // virgülü nokta yap
  
      if (numeric === '' || isNaN(numeric)) {
        input.value = '';
        return;
      }
  
      // ❷ Ondalık kısmı koru (en çok 2 hane)
      const [whole, decimal = ''] = numeric.split('.');
      const decPart = decimal.substring(0, 2);
  
      // ❸ Binlik ayıracı nokta olarak ekle
      const wholeWithDots = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
      // ❹ Alanı yeniden yaz
      input.value = decPart ? `${wholeWithDots},${decPart}` : wholeWithDots;
    }
  
    // ---------- 2.  Tutar input alanı ----------
    const tutarInput = document.getElementById('tutar');
  
    // Yazı girildikçe formatla
    tutarInput.addEventListener('input', function () {
      const posStart = this.selectionStart;
      const oldLen   = this.value.length;
  
      formatCurrencyInput(this);
  
      // İmleç konumunu koru
      const newLen = this.value.length;
      const diff   = newLen - oldLen;
      this.setSelectionRange(posStart + diff, posStart + diff);
    });
  
    // '.' veya ',' tuşuna basıldığında tek bir virgül ekle
    tutarInput.addEventListener('keydown', function (e) {
      if (e.key === ',' || e.key === '.') {
        e.preventDefault();
        if (!this.value.includes(',')) this.value += ',';
      }
    });
  
    // Formatlı değeri sayıya çevir
    function parseFormattedNumber(value) {
      if (!value) return 0;
      return parseFloat(value.replace(/\./g, '').replace(',', '.'));
    }
  
    /* ---------- 3.  Sekmeler (Makbuz / Faiz) ---------- */
    const tabMakbuz = document.getElementById('tab-makbuz');
    const tabFaiz   = document.getElementById('tab-faiz');
    const makbuzContent = document.getElementById('makbuz-content');
    const faizContent   = document.getElementById('faiz-content');
  
    tabMakbuz.addEventListener('click', () => {
      tabMakbuz.classList.add('active');
      tabFaiz.classList.remove('active');
      makbuzContent.style.display = 'block';
      faizContent.style.display   = 'none';
    });
  
    tabFaiz.addEventListener('click', () => {
      tabFaiz.classList.add('active');
      tabMakbuz.classList.remove('active');
      faizContent.style.display   = 'block';
      makbuzContent.style.display = 'none';
    });
  
    /* ---------- 4.  Makbuz Hesaplama ---------- */
    const makbuzForm   = document.getElementById('makbuz-form');
    const makbuzResult = document.getElementById('makbuz-result');
    const makbuzHistory = document.getElementById('makbuz-history');
  
    let makbuzHistoryData = JSON.parse(localStorage.getItem('makbuzHistory')) || [];
  
    makbuzForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      try {
        const kdvDahilToplam = parseFormattedNumber(tutarInput.value);
  
        if (isNaN(kdvDahilToplam) || kdvDahilToplam <= 0) {
          alert('Lütfen geçerli bir tutar giriniz.');
          return;
        }
  
        const kdvOrani  = parseFloat(document.getElementById('kdv-orani').value);
        const stopajOrani = parseFloat(document.getElementById('stopaj-orani').value);
        const tevkifatSecim = document.getElementById('tevkifat').value;
  
        // Brüt = Toplam / (1 + KDV Oranı)
        const brutTutar = kdvDahilToplam / (1 + kdvOrani);
        const kdvTutari = kdvDahilToplam - brutTutar;
  
        // Tevkifat
        let tevkifatOrani = 0;
        if (tevkifatSecim === 'evet' ||
            (tevkifatSecim === 'otomatik' && kdvDahilToplam > 9900)) {
          tevkifatOrani = 0.5;     // 5/10
        }
  
        const tevkifatTutari   = kdvTutari * tevkifatOrani;
        const tahsilEdilecekKDV = kdvTutari - tevkifatTutari;
  
        // Stopaj
        const stopajTutari = brutTutar * stopajOrani;
  
        // Net tahsilat
        const netTahsilat = brutTutar + tahsilEdilecekKDV - stopajTutari;
  
        // Sonuçları göster
        document.getElementById('result-brut').textContent    = formatCurrency(brutTutar);
        document.getElementById('result-kdv').textContent     = formatCurrency(kdvTutari);
        document.getElementById('result-tevkifat').textContent= formatCurrency(tevkifatTutari);
        document.getElementById('result-tahsil-kdv').textContent = formatCurrency(tahsilEdilecekKDV);
        document.getElementById('result-stopaj').textContent  = formatCurrency(stopajTutari);
        document.getElementById('result-toplam').textContent  = formatCurrency(kdvDahilToplam);
        document.getElementById('result-net').textContent     = formatCurrency(netTahsilat);
  
        makbuzResult.style.display = 'block';
  
        // Geçmiş kaydet
        makbuzHistoryData.unshift({
          tarih: new Date().toLocaleString('tr-TR'),
          kdvDahilToplam, brutTutar,
          kdvOrani: kdvOrani * 100,
          stopajOrani: stopajOrani * 100,
          tevkifat: tevkifatOrani > 0 ? 'Evet' : 'Hayır',
          netTahsilat
        });
        if (makbuzHistoryData.length > 10) makbuzHistoryData.pop();
  
        localStorage.setItem('makbuzHistory', JSON.stringify(makbuzHistoryData));
        updateMakbuzHistory();
      } catch (err) {
        console.error(err);
        alert('Hesaplama hatası. Lütfen girdileri kontrol edin.');
      }
    });
  
    function updateMakbuzHistory() {
      if (!makbuzHistoryData.length) {
        makbuzHistory.innerHTML = '<p>Henüz hesaplama yapılmadı.</p>';
        return;
      }
      makbuzHistory.innerHTML = makbuzHistoryData.map((h, i) => `
        <div class="history-item" data-index="${i}">
          <div class="history-date">${h.tarih}</div>
          <div>Toplam: ${formatCurrency(h.kdvDahilToplam)}
               | KDV: %${h.kdvOrani}
               | Net: ${formatCurrency(h.netTahsilat)}</div>
        </div>
      `).join('');
  
      document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
          const h = makbuzHistoryData[parseInt(item.dataset.index, 10)];
          tutarInput.value = formatManualCurrency(h.kdvDahilToplam);
          document.getElementById('kdv-orani').value   = h.kdvOrani / 100;
          document.getElementById('stopaj-orani').value= h.stopajOrani / 100;
          document.getElementById('tevkifat').value    = h.tevkifat === 'Evet' ? 'evet' : 'hayir';
          makbuzForm.dispatchEvent(new Event('submit'));
        });
      });
    }
    updateMakbuzHistory();
  
    /* ---------- 5.  Para Format Yardımcıları ---------- */
    function formatCurrency(amount) { return formatManualCurrency(amount) + ' ₺'; }
    function formatManualCurrency(amount) {
      const parts = amount.toFixed(2).toString().split('.');
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + parts[1];
    }
  });
  