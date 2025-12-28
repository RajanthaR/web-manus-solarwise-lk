import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, XCircle, Cpu, Sun, Battery, Globe, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Hardware() {
  const { data: panels, isLoading: panelsLoading } = trpc.panels.list.useQuery();
  const { data: inverters, isLoading: invertersLoading } = trpc.inverters.list.useQuery();
  const { data: batteries, isLoading: batteriesLoading } = trpc.batteries.list.useQuery();

  const getQualityClass = (score: number) => {
    if (score >= 8) return 'quality-excellent';
    if (score >= 6) return 'quality-good';
    if (score >= 4) return 'quality-average';
    return 'quality-poor';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Average';
    return 'Below Average';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Cpu className="w-4 h-4" />
            <span>Hardware Reviews</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hardware Quality Ratings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Global reviews මත පදනම් වූ Solar Panels, Inverters සහ Batteries ratings. 
            Efficiency, Degradation සහ Warranty විස්තර.
          </p>
        </div>

        <Tabs defaultValue="panels" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="panels" className="gap-2">
              <Sun className="w-4 h-4" />
              Solar Panels
            </TabsTrigger>
            <TabsTrigger value="inverters" className="gap-2">
              <Cpu className="w-4 h-4" />
              Inverters
            </TabsTrigger>
            <TabsTrigger value="batteries" className="gap-2">
              <Battery className="w-4 h-4" />
              Batteries
            </TabsTrigger>
          </TabsList>

          {/* Panels Tab */}
          <TabsContent value="panels">
            {panelsLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : panels && panels.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {panels.map((item) => (
                  <Card key={item.panel.id} className="card-hover">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.brand?.name} {item.panel.model}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            {item.brand?.country && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {item.brand.country}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        {item.panel.qualityScore && (
                          <div className="text-center">
                            <Badge className={`${getQualityClass(Number(item.panel.qualityScore))} text-sm px-3 py-1`}>
                              {Number(item.panel.qualityScore).toFixed(1)}/10
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {getQualityLabel(Number(item.panel.qualityScore))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Specs Grid */}
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold text-lg">{item.panel.wattage}W</div>
                          <div className="text-xs text-muted-foreground">Wattage</div>
                        </div>
                        {item.panel.efficiency && (
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-bold text-lg">{item.panel.efficiency}%</div>
                            <div className="text-xs text-muted-foreground">Efficiency</div>
                          </div>
                        )}
                        {item.panel.warrantyYears && (
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-bold text-lg">{item.panel.warrantyYears}Y</div>
                            <div className="text-xs text-muted-foreground">Warranty</div>
                          </div>
                        )}
                      </div>

                      {/* Additional Specs */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {item.panel.cellType && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cell Type:</span>
                            <span className="font-medium">{item.panel.cellType}</span>
                          </div>
                        )}
                        {item.panel.degradationAnnual && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Degradation:</span>
                            <span className="font-medium">{item.panel.degradationAnnual}%/year</span>
                          </div>
                        )}
                        {item.panel.output25Years && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">25Y Output:</span>
                            <span className="font-medium">{item.panel.output25Years}%</span>
                          </div>
                        )}
                        {item.panel.globalRating && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Global Rating:</span>
                            <span className="font-medium flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              {item.panel.globalRating}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pros/Cons */}
                      {(item.panel.pros || item.panel.cons) && (
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                          {item.panel.pros && item.panel.pros.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Pros
                              </h5>
                              <ul className="space-y-1">
                                {item.panel.pros.slice(0, 3).map((pro, i) => (
                                  <li key={i} className="text-xs text-muted-foreground">• {pro}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {item.panel.cons && item.panel.cons.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Cons
                              </h5>
                              <ul className="space-y-1">
                                {item.panel.cons.slice(0, 3).map((con, i) => (
                                  <li key={i} className="text-xs text-muted-foreground">• {con}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {item.panel.reviewSummary && (
                        <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                          "{item.panel.reviewSummary}"
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Sun className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Panel reviews ඉක්මනින් එකතු වේ</p>
              </Card>
            )}
          </TabsContent>

          {/* Inverters Tab */}
          <TabsContent value="inverters">
            {invertersLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : inverters && inverters.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {inverters.map((item) => (
                  <Card key={item.inverter.id} className="card-hover">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.brand?.name} {item.inverter.model}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {item.inverter.type}
                            </Badge>
                            {item.inverter.phases && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {item.inverter.phases} Phase
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                        {item.inverter.qualityScore && (
                          <div className="text-center">
                            <Badge className={`${getQualityClass(Number(item.inverter.qualityScore))} text-sm px-3 py-1`}>
                              {Number(item.inverter.qualityScore).toFixed(1)}/10
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {getQualityLabel(Number(item.inverter.qualityScore))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Specs Grid */}
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold text-lg">{item.inverter.capacity}kW</div>
                          <div className="text-xs text-muted-foreground">Capacity</div>
                        </div>
                        {item.inverter.efficiency && (
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-bold text-lg">{item.inverter.efficiency}%</div>
                            <div className="text-xs text-muted-foreground">Efficiency</div>
                          </div>
                        )}
                        {item.inverter.warrantyYears && (
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-bold text-lg">{item.inverter.warrantyYears}Y</div>
                            <div className="text-xs text-muted-foreground">Warranty</div>
                          </div>
                        )}
                      </div>

                      {/* Additional Specs */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {item.inverter.mpptTrackers && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">MPPT:</span>
                            <span className="font-medium">{item.inverter.mpptTrackers} trackers</span>
                          </div>
                        )}
                        {item.inverter.maxDcInput && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Max DC:</span>
                            <span className="font-medium">{item.inverter.maxDcInput}</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {item.inverter.features && item.inverter.features.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.inverter.features.slice(0, 4).map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Pros/Cons */}
                      {(item.inverter.pros || item.inverter.cons) && (
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                          {item.inverter.pros && item.inverter.pros.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Pros
                              </h5>
                              <ul className="space-y-1">
                                {item.inverter.pros.slice(0, 3).map((pro, i) => (
                                  <li key={i} className="text-xs text-muted-foreground">• {pro}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {item.inverter.cons && item.inverter.cons.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Cons
                              </h5>
                              <ul className="space-y-1">
                                {item.inverter.cons.slice(0, 3).map((con, i) => (
                                  <li key={i} className="text-xs text-muted-foreground">• {con}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {item.inverter.reviewSummary && (
                        <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                          "{item.inverter.reviewSummary}"
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Cpu className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Inverter reviews ඉක්මනින් එකතු වේ</p>
              </Card>
            )}
          </TabsContent>

          {/* Batteries Tab */}
          <TabsContent value="batteries">
            {batteriesLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : batteries && batteries.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {batteries.map((item) => (
                  <Card key={item.battery.id} className="card-hover">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.brand?.name} {item.battery.model}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs uppercase">
                              {item.battery.type}
                            </Badge>
                          </CardDescription>
                        </div>
                        {item.battery.qualityScore && (
                          <div className="text-center">
                            <Badge className={`${getQualityClass(Number(item.battery.qualityScore))} text-sm px-3 py-1`}>
                              {Number(item.battery.qualityScore).toFixed(1)}/10
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {getQualityLabel(Number(item.battery.qualityScore))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Specs Grid */}
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold text-lg">{item.battery.capacityKwh}kWh</div>
                          <div className="text-xs text-muted-foreground">Capacity</div>
                        </div>
                        {item.battery.cycleLife && (
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-bold text-lg">{item.battery.cycleLife}</div>
                            <div className="text-xs text-muted-foreground">Cycles</div>
                          </div>
                        )}
                        {item.battery.warrantyYears && (
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-bold text-lg">{item.battery.warrantyYears}Y</div>
                            <div className="text-xs text-muted-foreground">Warranty</div>
                          </div>
                        )}
                      </div>

                      {/* Additional Specs */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {item.battery.voltage && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Voltage:</span>
                            <span className="font-medium">{item.battery.voltage}V</span>
                          </div>
                        )}
                        {item.battery.depthOfDischarge && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">DoD:</span>
                            <span className="font-medium">{item.battery.depthOfDischarge}%</span>
                          </div>
                        )}
                      </div>

                      {/* Pros/Cons */}
                      {(item.battery.pros || item.battery.cons) && (
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                          {item.battery.pros && item.battery.pros.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Pros
                              </h5>
                              <ul className="space-y-1">
                                {item.battery.pros.slice(0, 3).map((pro, i) => (
                                  <li key={i} className="text-xs text-muted-foreground">• {pro}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {item.battery.cons && item.battery.cons.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Cons
                              </h5>
                              <ul className="space-y-1">
                                {item.battery.cons.slice(0, 3).map((con, i) => (
                                  <li key={i} className="text-xs text-muted-foreground">• {con}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Battery className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Battery reviews ඉක්මනින් එකතු වේ</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Rating Legend */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-5 h-5" />
                Quality Score Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="quality-excellent">8-10</Badge>
                  <span>Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="quality-good">6-8</Badge>
                  <span>Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="quality-average">4-6</Badge>
                  <span>Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="quality-poor">&lt;4</Badge>
                  <span>Below Average</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Ratings are based on global reviews, efficiency data, warranty reputation, and user feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
