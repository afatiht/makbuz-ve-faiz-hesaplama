import { useState } from "react";

interface VekaletHesapResult {
  vekaletUcreti: number;
  kesinlesucreti: number;
  kesinlesmeOncesi: boolean;
  hesaplamaDetaylari: string;
}

// 2025 Yılı Dilimli Vekalet Ücreti Hesaplama Fonksiyonu (TBB Tablosuna Göre)
const hesaplaVekaletUcreti = (alacakTutari: number): number => {
  let toplamVekaletUcreti = 0;
  let kalanTutar = alacakTutari;

  // İlk 400.000 TL için %16
  if (kalanTutar > 0) {
    const ilkDilim = Math.min(kalanTutar, 400000);
    toplamVekaletUcreti += ilkDilim * 0.16;
    kalanTutar -= ilkDilim;
  }

  // Sonraki 400.000 TL için %15 (400.001-800.000)
  if (kalanTutar > 0) {
    const ikinciDilim = Math.min(kalanTutar, 400000);
    toplamVekaletUcreti += ikinciDilim * 0.15;
    kalanTutar -= ikinciDilim;
  }

  // Sonraki 800.000 TL için %14 (800.001-1.600.000)
  if (kalanTutar > 0) {
    const ucuncuDilim = Math.min(kalanTutar, 800000);
    toplamVekaletUcreti += ucuncuDilim * 0.14;
    kalanTutar -= ucuncuDilim;
  }

  // Sonraki 1.200.000 TL için %11 (1.600.001-2.800.000)
  if (kalanTutar > 0) {
    const dorduncuDilim = Math.min(kalanTutar, 1200000);
    toplamVekaletUcreti += dorduncuDilim * 0.11;
    kalanTutar -= dorduncuDilim;
  }

  // Sonraki 1.600.000 TL için %8 (2.800.001-4.400.000)
  if (kalanTutar > 0) {
    const besinciDilim = Math.min(kalanTutar, 1600000);
    toplamVekaletUcreti += besinciDilim * 0.08;
    kalanTutar -= besinciDilim;
  }

  // Sonraki 2.000.000 TL için %5 (4.400.001-6.400.000)
  if (kalanTutar > 0) {
    const altinciDilim = Math.min(kalanTutar, 2000000);
    toplamVekaletUcreti += altinciDilim * 0.05;
    kalanTutar -= altinciDilim;
  }

  // Sonraki 2.400.000 TL için %3 (6.400.001-8.800.000)
  if (kalanTutar > 0) {
    const yedinciDilim = Math.min(kalanTutar, 2400000);
    toplamVekaletUcreti += yedinciDilim * 0.03;
    kalanTutar -= yedinciDilim;
  }

  // Sonraki 2.800.000 TL için %2 (8.800.001-11.600.000)
  if (kalanTutar > 0) {
    const sekizinciDilim = Math.min(kalanTutar, 2800000);
    toplamVekaletUcreti += sekizinciDilim * 0.02;
    kalanTutar -= sekizinciDilim;
  }

  // 11.600.000 TL üzeri için %1
  if (kalanTutar > 0) {
    toplamVekaletUcreti += kalanTutar * 0.01;
  }

  return toplamVekaletUcreti;
};

// Dilim detaylarını hesaplayan fonksiyon (TBB Tablosuna Göre)
const hesaplamaDilimDetaylari = (alacakTutari: number): string => {
  let detaylar = "Dilim hesaplaması: ";
  let kalanTutar = alacakTutari;
  const dilimler = [];

  if (kalanTutar > 0) {
    const ilkDilim = Math.min(kalanTutar, 400000);
    dilimler.push(`İlk ${ilkDilim.toLocaleString('tr-TR')} TL × %16`);
    kalanTutar -= ilkDilim;
  }

  if (kalanTutar > 0) {
    const ikinciDilim = Math.min(kalanTutar, 400000);
    dilimler.push(`Sonraki ${ikinciDilim.toLocaleString('tr-TR')} TL × %15`);
    kalanTutar -= ikinciDilim;
  }

  if (kalanTutar > 0) {
    const ucuncuDilim = Math.min(kalanTutar, 800000);
    dilimler.push(`Sonraki ${ucuncuDilim.toLocaleString('tr-TR')} TL × %14`);
    kalanTutar -= ucuncuDilim;
  }

  if (kalanTutar > 0) {
    const dorduncuDilim = Math.min(kalanTutar, 1200000);
    dilimler.push(`Sonraki ${dorduncuDilim.toLocaleString('tr-TR')} TL × %11`);
    kalanTutar -= dorduncuDilim;
  }

  if (kalanTutar > 0) {
    const besinciDilim = Math.min(kalanTutar, 1600000);
    dilimler.push(`Sonraki ${besinciDilim.toLocaleString('tr-TR')} TL × %8`);
    kalanTutar -= besinciDilim;
  }

  if (kalanTutar > 0) {
    const altinciDilim = Math.min(kalanTutar, 2000000);
    dilimler.push(`Sonraki ${altinciDilim.toLocaleString('tr-TR')} TL × %5`);
    kalanTutar -= altinciDilim;
  }

  if (kalanTutar > 0) {
    const yedinciDilim = Math.min(kalanTutar, 2400000);
    dilimler.push(`Sonraki ${yedinciDilim.toLocaleString('tr-TR')} TL × %3`);
    kalanTutar -= yedinciDilim;
  }

  if (kalanTutar > 0) {
    const sekizinciDilim = Math.min(kalanTutar, 2800000);
    dilimler.push(`Sonraki ${sekizinciDilim.toLocaleString('tr-TR')} TL × %2`);
    kalanTutar -= sekizinciDilim;
  }

  if (kalanTutar > 0) {
    dilimler.push(`Kalan ${kalanTutar.toLocaleString('tr-TR')} TL × %1`);
  }

  return detaylar + dilimler.join(" + ");
};

export const VekaletCalculatorSimple = () => {
  const [vekaletTutari, setVekaletTutari] = useState<string>("");
  const [vekaletKesinlesme, setVekaletKesinlesme] = useState<string>("oncesi");
  const [vekaletSonuc, setVekaletSonuc] = useState<VekaletHesapResult | null>(null);


  const hesaplaVekalet = () => {
    if (!vekaletTutari) {
      alert("Lütfen vekalet ücreti tutarını girin.");
      return;
    }

    const vekalet = parseFloat(vekaletTutari.replace(/[.,]/g, match => match === ',' ? '.' : ''));
    
    if (isNaN(vekalet) || vekalet <= 0) {
      alert("Lütfen geçerli bir vekalet ücreti tutarı girin.");
      return;
    }

    const sureDahilinde = vekaletKesinlesme === "oncesi";
    let kesinlesucreti: number;
    let hesaplamaDetaylari: string;
    
    if (sureDahilinde) {
      // Kesinleşme öncesi ödeme - 3/4 oranı uygulanır
      kesinlesucreti = vekalet * 0.75;
      hesaplamaDetaylari = `${vekalet.toLocaleString('tr-TR')} TL vekalet ücreti kesinleşme öncesi (7 gün içinde) ödenirse 3/4 oranı uygulanarak ${kesinlesucreti.toLocaleString('tr-TR')} TL olur.`;
    } else {
      // Kesinleşme sonrası ödeme - tam tutar
      kesinlesucreti = vekalet;
      hesaplamaDetaylari = `${vekalet.toLocaleString('tr-TR')} TL vekalet ücreti kesinleşme sonrası ödenirse tam tutarı ödenir.`;
    }

    setVekaletSonuc({
      vekaletUcreti: vekalet,
      kesinlesucreti,
      kesinlesmeOncesi: sureDahilinde,
      hesaplamaDetaylari
    });
  };

  const vekaletTemizle = () => {
    setVekaletTutari("");
    setVekaletKesinlesme("oncesi");
    setVekaletSonuc(null);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>
            Vekalet Ücreti Kesinleşme Hesaplama
          </h2>
          <p style={{ color: '#6b7280' }}>Hesaplanmış vekalet ücretinin kesinleşme öncesi tutarını hesaplayın</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Form */}
          <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Vekalet Ücreti (TL)
              </label>
              <input
                type="text"
                placeholder="Örnek: 6.000"
                value={vekaletTutari}
                onChange={(e) => setVekaletTutari(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Ödeme Zamanı</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="vekaletKesinlesme"
                    value="oncesi"
                    checked={vekaletKesinlesme === "oncesi"}
                    onChange={(e) => setVekaletKesinlesme(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  Kesinleşme öncesi (7 gün içinde)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="vekaletKesinlesme"
                    value="sonrasi"
                    checked={vekaletKesinlesme === "sonrasi"}
                    onChange={(e) => setVekaletKesinlesme(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  Kesinleşme sonrası (7 gün sonra)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={hesaplaVekalet}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                📊 Hesapla
              </button>
              <button
                onClick={vekaletTemizle}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Temizle
              </button>
            </div>
          </div>

          {/* Sonuç */}
          <div>
            {vekaletSonuc ? (
              <div style={{ 
                padding: '20px', 
                border: '2px solid #2563eb', 
                borderRadius: '8px', 
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>Hesaplama Sonucu</h3>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: vekaletSonuc.kesinlesmeOncesi ? '#2563eb' : '#6b7280', 
                    color: 'white', 
                    borderRadius: '4px', 
                    fontSize: '12px' 
                  }}>
                    {vekaletSonuc.kesinlesmeOncesi ? "Kesinleşme Öncesi" : "Kesinleşme Sonrası"}
                  </span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px' }}>Ödenecek Tutar</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>
                    {vekaletSonuc.kesinlesucreti.toLocaleString('tr-TR', { 
                      style: 'currency', 
                      currency: 'TRY' 
                    })}
                  </p>
                </div>

                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

                <div>
                  <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Hesaplama Detayları:</p>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                    {vekaletSonuc.hesaplamaDetaylari}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '40px', 
                border: '2px dashed #d1d5db', 
                borderRadius: '8px', 
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <p>Hesaplama yapmak için formu doldurun</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};