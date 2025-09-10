import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface CalculationResult {
  alacakTutari: number;
  vekaletUcreti: number;
  toplamTutar: number;
  kesinlesmeOncesi: boolean;
  hesaplamaDetaylari: string;
}

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

export const VekaletCalculator = () => {
  const [alacakTutari, setAlacakTutari] = useState<string>("");
  const [kesinlesmeOncesi, setKesinlesmeOncesi] = useState<string>("oncesi");
  const [sonuc, setSonuc] = useState<CalculationResult | null>(null);
  
  // Vekalet ücreti tersine hesaplama için state'ler
  const [vekaletTutari, setVekaletTutari] = useState<string>("");
  const [vekaletKesinlesme, setVekaletKesinlesme] = useState<string>("oncesi");
  const [vekaletSonuc, setVekaletSonuc] = useState<VekaletHesapResult | null>(null);
  
  const { toast } = useToast();

  const hesapla = () => {
    if (!alacakTutari) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen alacak tutarını girin.",
        variant: "destructive",
      });
      return;
    }

    const alacak = parseFloat(alacakTutari.replace(/[.,]/g, match => match === ',' ? '.' : ''));
    
    if (isNaN(alacak) || alacak <= 0) {
      toast({
        title: "Geçersiz Tutar",
        description: "Lütfen geçerli bir alacak tutarı girin.",
        variant: "destructive",
      });
      return;
    }

    const sureDahilinde = kesinlesmeOncesi === "oncesi";
    
    // 2025 Yılı Dilimli Vekalet Ücreti Hesaplama
    const hesaplananVekaletUcreti = hesaplaVekaletUcreti(alacak);
    const minimumVekaletUcreti = 6500; // 2025 yılı minimum maktu tutar (TL)
    
    // Minimum tutar kontrolü
    let temelVekaletUcreti = Math.max(hesaplananVekaletUcreti, minimumVekaletUcreti);
    
    // 7 günlük süre kuralı uygulaması
    let vekaletUcreti: number;
    let hesaplamaDetaylari: string;
    
    if (sureDahilinde) {
      // Kesinleşme öncesi ödeme - 3/4 oranı
      vekaletUcreti = temelVekaletUcreti * 0.75;
      hesaplamaDetaylari = `7 günlük süre içinde ödeme yapıldığı için vekalet ücretinin 3/4'ü (${(0.75 * 100).toFixed(0)}%) uygulanmıştır.`;
    } else {
      // Kesinleşme sonrası ödeme - tam tutar
      vekaletUcreti = temelVekaletUcreti;
      hesaplamaDetaylari = `7 günlük süre geçtikten sonra ödeme yapıldığı için vekalet ücretinin tamamı uygulanmıştır.`;
    }

    const toplamTutar = alacak + vekaletUcreti;

    // Detaylı hesaplama açıklaması
    const dilimDetaylari = hesaplamaDilimDetaylari(alacak);
    const minimumKontrol = hesaplananVekaletUcreti < minimumVekaletUcreti ? 
      ` Hesaplanan tutar minimum maktu tutardan (${minimumVekaletUcreti.toLocaleString('tr-TR')} TL) düşük olduğu için minimum tutar uygulandı.` : "";
    
    hesaplamaDetaylari += ` ${dilimDetaylari}${minimumKontrol}`;

    setSonuc({
      alacakTutari: alacak,
      vekaletUcreti,
      toplamTutar,
      kesinlesmeOncesi: sureDahilinde,
      hesaplamaDetaylari
    });

    toast({
      title: "Hesaplama Tamamlandı",
      description: "Vekalet ücreti başarıyla hesaplandı.",
    });
  };

  const hesaplaVekalet = () => {
    if (!vekaletTutari) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen vekalet ücreti tutarını girin.",
        variant: "destructive",
      });
      return;
    }

    const vekalet = parseFloat(vekaletTutari.replace(/[.,]/g, match => match === ',' ? '.' : ''));
    
    if (isNaN(vekalet) || vekalet <= 0) {
      toast({
        title: "Geçersiz Tutar",
        description: "Lütfen geçerli bir vekalet ücreti tutarı girin.",
        variant: "destructive",
      });
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

    toast({
      title: "Hesaplama Tamamlandı",
      description: "Vekalet ücreti hesaplandı.",
    });
  };

  const temizle = () => {
    setAlacakTutari("");
    setKesinlesmeOncesi("oncesi");
    setSonuc(null);
  };

  const vekaletTemizle = () => {
    setVekaletTutari("");
    setVekaletKesinlesme("oncesi");
    setVekaletSonuc(null);
  };

  return (
    <div className="space-y-8">
      {/* Ana Vekalet Ücreti Hesaplama */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary">Alacak Tutarından Vekalet Ücreti Hesaplama</h2>
          <p className="text-muted-foreground">Alacak tutarınızı girerek vekalet ücreti hesaplayın</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alacak" className="text-base font-medium">
                Alacak Tutarı (TL)
              </Label>
              <Input
                id="alacak"
                type="text"
                placeholder="Örnek: 100.000"
                value={alacakTutari}
                onChange={(e) => setAlacakTutari(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Ödeme Zamanı</Label>
              <RadioGroup value={kesinlesmeOncesi} onValueChange={setKesinlesmeOncesi}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oncesi" id="oncesi" />
                  <Label htmlFor="oncesi" className="font-normal cursor-pointer">
                    Kesinleşme öncesi (7 gün içinde)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sonrasi" id="sonrasi" />
                  <Label htmlFor="sonrasi" className="font-normal cursor-pointer">
                    Kesinleşme sonrası (7 gün sonra)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={hesapla} className="flex-1" size="lg">
                <Calculator className="mr-2 h-4 w-4" />
                Hesapla
              </Button>
              <Button onClick={temizle} variant="outline" size="lg">
                Temizle
              </Button>
            </div>
          </div>

          {/* Sonuç */}
          <div>
            {sonuc ? (
              <Card className="border-primary/20 bg-accent/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-primary">Hesaplama Sonucu</CardTitle>
                    <Badge variant={sonuc.kesinlesmeOncesi ? "default" : "secondary"}>
                      {sonuc.kesinlesmeOncesi ? "Kesinleşme Öncesi" : "Kesinleşme Sonrası"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Alacak Tutarı</p>
                      <p className="font-semibold text-lg">
                        {sonuc.alacakTutari.toLocaleString('tr-TR', { 
                          style: 'currency', 
                          currency: 'TRY' 
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Vekalet Ücreti</p>
                      <p className="font-semibold text-lg text-primary">
                        {sonuc.vekaletUcreti.toLocaleString('tr-TR', { 
                          style: 'currency', 
                          currency: 'TRY' 
                        })}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-1">Toplam Tutar</p>
                    <p className="text-2xl font-bold text-primary">
                      {sonuc.toplamTutar.toLocaleString('tr-TR', { 
                        style: 'currency', 
                        currency: 'TRY' 
                      })}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Hesaplama Detayları:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {sonuc.hesaplamaDetaylari}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center h-64 text-center">
                  <div className="space-y-2">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Hesaplama yapmak için formu doldurun
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Vekalet Ücreti Tersine Hesaplama */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary">Vekalet Ücreti Kesinleşme Hesaplama</h2>
          <p className="text-muted-foreground">Hesaplanmış vekalet ücretinin kesinleşme öncesi tutarını hesaplayın</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vekalet" className="text-base font-medium">
                Vekalet Ücreti (TL)
              </Label>
              <Input
                id="vekalet"
                type="text"
                placeholder="Örnek: 6.000"
                value={vekaletTutari}
                onChange={(e) => setVekaletTutari(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Ödeme Zamanı</Label>
              <RadioGroup value={vekaletKesinlesme} onValueChange={setVekaletKesinlesme}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oncesi" id="vekalet-oncesi" />
                  <Label htmlFor="vekalet-oncesi" className="font-normal cursor-pointer">
                    Kesinleşme öncesi (7 gün içinde)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sonrasi" id="vekalet-sonrasi" />
                  <Label htmlFor="vekalet-sonrasi" className="font-normal cursor-pointer">
                    Kesinleşme sonrası (7 gün sonra)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={hesaplaVekalet} className="flex-1" size="lg">
                <Calculator className="mr-2 h-4 w-4" />
                Hesapla
              </Button>
              <Button onClick={vekaletTemizle} variant="outline" size="lg">
                Temizle
              </Button>
            </div>
          </div>

          {/* Sonuç */}
          <div>
            {vekaletSonuc ? (
              <Card className="border-primary/20 bg-accent/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-primary">Hesaplama Sonucu</CardTitle>
                    <Badge variant={vekaletSonuc.kesinlesmeOncesi ? "default" : "secondary"}>
                      {vekaletSonuc.kesinlesmeOncesi ? "Kesinleşme Öncesi" : "Kesinleşme Sonrası"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Hesaplanan Vekalet Ücreti</p>
                      <p className="font-semibold text-lg">
                        {vekaletSonuc.vekaletUcreti.toLocaleString('tr-TR', { 
                          style: 'currency', 
                          currency: 'TRY' 
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Ödenecek Tutar</p>
                      <p className="font-semibold text-lg text-primary">
                        {vekaletSonuc.kesinlesucreti.toLocaleString('tr-TR', { 
                          style: 'currency', 
                          currency: 'TRY' 
                        })}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-1">
                      {vekaletSonuc.kesinlesmeOncesi ? "Kesinleşme Öncesi Ödenecek" : "Kesinleşme Sonrası Ödenecek"}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {vekaletSonuc.kesinlesucreti.toLocaleString('tr-TR', { 
                        style: 'currency', 
                        currency: 'TRY' 
                      })}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Hesaplama Detayları:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {vekaletSonuc.hesaplamaDetaylari}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center h-64 text-center">
                  <div className="space-y-2">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Hesaplama yapmak için vekalet ücretini girin
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};