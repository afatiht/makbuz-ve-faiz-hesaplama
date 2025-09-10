import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VekaletCalculator } from "@/components/VekaletCalculator";
import { Calculator, Scale } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">İcra Vekalet Ücreti Hesaplama</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            İcra dosyalarınızda vekalet ücreti hesaplaması yapın. Tebligat süresine göre otomatik hesaplama.
          </p>
        </div>

        {/* Main Calculator */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-2">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calculator className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Vekalet Ücreti Hesaplama</CardTitle>
              </div>
              <CardDescription className="text-base">
                Alacak tutarını ve tarihleri girerek vekalet ücretini hesaplayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VekaletCalculator />
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Tebligat Süresi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tebligat tarihinden itibaren 7 gün içerisinde ödeme yapılırsa farklı hesaplama uygulanır.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Otomatik Hesaplama</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sistem, girilen tarihlere göre otomatik olarak doğru hesaplama yöntemini uygular.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Detaylı Sonuç</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Hesaplama detayları ve yasal dayanaklarıyla birlikte sonuç gösterilir.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;