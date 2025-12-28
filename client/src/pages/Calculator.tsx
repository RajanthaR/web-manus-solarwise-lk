import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { Calculator, Zap, TrendingUp, Sun, ArrowRight, Info, Lightbulb } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function CalculatorPage() {
  const [monthlyBill, setMonthlyBill] = useState<number>(15000);
  const [systemPrice, setSystemPrice] = useState<number | undefined>();

  const { data: calculation, isLoading } = trpc.calculator.calculate.useQuery({
    monthlyBillLKR: monthlyBill,
    systemPriceLKR: systemPrice,
  }, {
    enabled: monthlyBill > 0,
  });

  const handleBillChange = (value: string) => {
    const num = parseInt(value) || 0;
    setMonthlyBill(num);
  };

  const handlePriceChange = (value: string) => {
    const num = parseInt(value) || undefined;
    setSystemPrice(num);
  };

  const quickBillOptions = [5000, 10000, 15000, 25000, 35000, 50000];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            <span>ROI Calculator</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ඔබේ Solar System Size ගණනය කරන්න
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ඔබේ මාසික CEB bill එක ඇතුළත් කර, ඔබට ගැලපෙන System Size සහ 
            ROI (Return on Investment) ගණනය කරන්න
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  ඔබේ විදුලි බිල්පත
                </CardTitle>
                <CardDescription>
                  මාසික CEB bill එක LKR වලින් ඇතුළත් කරන්න
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="bill" className="text-base">මාසික Bill (LKR)</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rs.</span>
                    <Input
                      id="bill"
                      type="number"
                      value={monthlyBill}
                      onChange={(e) => handleBillChange(e.target.value)}
                      className="pl-12 text-lg h-12"
                      placeholder="15000"
                    />
                  </div>
                </div>

                {/* Quick Select */}
                <div>
                  <Label className="text-sm text-muted-foreground">ඉක්මන් තේරීම</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {quickBillOptions.map((amount) => (
                      <Button
                        key={amount}
                        variant={monthlyBill === amount ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMonthlyBill(amount)}
                      >
                        Rs. {amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label htmlFor="price" className="text-base">System මිල (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    නිශ්චිත ROI ගණනය කිරීමට system මිල ඇතුළත් කරන්න
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rs.</span>
                    <Input
                      id="price"
                      type="number"
                      value={systemPrice || ''}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="pl-12"
                      placeholder="700000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CEB Tariff Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-blue-800">
                  <Info className="w-4 h-4" />
                  CEB Tariff Rates (2025)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• 0-60 units: Rs. 11/unit</p>
                  <p>• 61-90 units: Rs. 14/unit + Rs. 400 fixed</p>
                  <p>• 91-120 units: Rs. 25/unit + Rs. 1,000 fixed</p>
                  <p>• 121-180 units: Rs. 33/unit + Rs. 1,500 fixed</p>
                  <p>• 180+ units: Rs. 52/unit + Rs. 2,000 fixed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {isLoading ? (
              <Card className="animate-pulse">
                <CardContent className="p-8">
                  <div className="h-8 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-24 bg-muted rounded" />
                </CardContent>
              </Card>
            ) : calculation?.recommendation ? (
              <>
                {/* Main Recommendation */}
                <Card className="solar-gradient text-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sun className="w-6 h-6" />
                      <span className="font-medium">නිර්දේශිත System</span>
                    </div>
                    <div className="text-5xl font-bold mb-2">
                      {calculation.recommendation.capacityKW} kW
                    </div>
                    <p className="text-white/80">
                      ඔබේ Rs. {monthlyBill.toLocaleString()} bill එකට ගැලපෙන System Size
                    </p>
                  </CardContent>
                </Card>

                {/* Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>ගණනය කිරීමේ විස්තර</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">ඇස්තමේන්තුගත Units</div>
                        <div className="text-2xl font-bold">{calculation.recommendation.estimatedUnits}</div>
                        <div className="text-sm text-muted-foreground">units/මාසය</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Solar Generation</div>
                        <div className="text-2xl font-bold">
                          {Math.round(calculation.recommendation.capacityKW * 130)}
                        </div>
                        <div className="text-sm text-muted-foreground">kWh/මාසය</div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-700 mb-2">ඇස්තමේන්තුගත මිල පරාසය</div>
                      <div className="text-xl font-bold text-green-800">
                        Rs. {calculation.recommendation.minPriceRange.toLocaleString()} - Rs. {calculation.recommendation.maxPriceRange.toLocaleString()}
                      </div>
                    </div>

                    {/* ROI Details */}
                    {calculation.roi && (
                      <div className="pt-4 border-t space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          ROI ගණනය
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">මාසික ඉතිරිය</div>
                            <div className="text-xl font-bold text-green-600">
                              Rs. {Math.round(calculation.roi.estimatedMonthlySavingsLKR).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">වාර්ෂික ඉතිරිය</div>
                            <div className="text-xl font-bold text-green-600">
                              Rs. {Math.round(calculation.roi.estimatedAnnualSavingsLKR).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-primary/10 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Payback Period</span>
                            <span className="text-2xl font-bold text-primary">
                              {calculation.roi.paybackYears} වසර
                            </span>
                          </div>
                          <Progress 
                            value={Math.min((25 - calculation.roi.paybackYears) / 25 * 100, 100)} 
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            {calculation.roi.paybackYears} වසරකින් පසු ඔබේ system එක නොමිලේ විදුලිය ජනනය කරයි
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tariff Breakdown */}
                {calculation.roi?.tariffBreakdown && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Tariff Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {calculation.roi.tariffBreakdown.map((block, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Block {block.block}: {block.units} units @ Rs. {block.rate}
                            </span>
                            <span className="font-medium">Rs. {block.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* CTA */}
                <Card className="bg-muted/30">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">ඊළඟ පියවර</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      ඔබේ {calculation.recommendation.capacityKW} kW system එකට ගැලපෙන packages බලන්න
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/packages?minCapacity=${Math.floor(calculation.recommendation.capacityKW)}&maxCapacity=${Math.ceil(calculation.recommendation.capacityKW) + 1}`}>
                        <Button className="gap-2">
                          Packages බලන්න
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href="/chat">
                        <Button variant="outline">
                          AI උපදේශක සමඟ කතා කරන්න
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="p-8 text-center">
                <Calculator className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  ඔබේ bill amount ඇතුළත් කරන්න
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">ගණනය කිරීමේ ක්‍රමය</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>System Size:</strong> ඔබේ මාසික units භාවිතය / 130 (ශ්‍රී ලංකාවේ සාමාන්‍ය මාසික generation per kW)
              </p>
              <p>
                <strong>ROI:</strong> System මිල / වාර්ෂික ඉතිරිය = Payback period (වසර)
              </p>
              <p>
                <strong>සටහන:</strong> මෙම ගණනය ඇස්තමේන්තුවක් පමණි. සැබෑ generation ඔබේ ස්ථානය, 
                panel orientation, shading සහ weather conditions මත රඳා පවතී.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
