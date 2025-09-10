import { VekaletCalculatorSimple } from "@/components/VekaletCalculatorSimple";

const Index = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '32px' }}>⚖️</span>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>İcra Vekalet Ücreti Hesaplama</h1>
          </div>
          <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            İcra dosyalarınızda vekalet ücreti hesaplaması yapın. Tebligat süresine göre otomatik hesaplama.
          </p>
        </div>

        {/* Main Calculator */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ 
            padding: '24px', 
            backgroundColor: 'white', 
            border: '2px solid #e5e7eb', 
            borderRadius: '12px', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>📊</span>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>Vekalet Ücreti Hesaplama</h2>
              </div>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Alacak tutarını ve tarihleri girerek vekalet ücretini hesaplayın
              </p>
            </div>
            <VekaletCalculatorSimple />
          </div>
        </div>

        {/* Info Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px', 
          marginTop: '48px', 
          maxWidth: '1000px', 
          margin: '48px auto 0' 
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', marginBottom: '12px' }}>Tebligat Süresi</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
              Tebligat tarihinden itibaren 7 gün içerisinde ödeme yapılırsa farklı hesaplama uygulanır.
            </p>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', marginBottom: '12px' }}>Otomatik Hesaplama</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
              Sistem, girilen tarihlere göre otomatik olarak doğru hesaplama yöntemini uygular.
            </p>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', marginBottom: '12px' }}>Detaylı Sonuç</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
              Hesaplama detayları ve yasal dayanaklarıyla birlikte sonuç gösterilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;