import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, Link } from "wouter";
import { ArrowLeft, Star, TrendingUp, Zap, Shield, Phone, Mail, Globe, CheckCircle, XCircle, Info } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const packageId = parseInt(id || '0');
  
  const { data: packageData, isLoading } = trpc.packages.getById.useQuery({ id: packageId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Package හමු නොවීය</h2>
            <p className="text-muted-foreground mb-4">මෙම package එක තවදුරටත් නොපවතී</p>
            <Link href="/packages">
              <Button>Packages වෙත ආපසු</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const { package: pkg, provider, panel, inverter, battery } = packageData;

  const getQualityClass = (score: number) => {
    if (score >= 8) return 'quality-excellent';
    if (score >= 6) return 'quality-good';
    if (score >= 4) return 'quality-average';
    return 'quality-poor';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Back Button */}
        <Link href="/packages">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Packages වෙත ආපසු
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={
                    pkg.type === 'on-grid' ? 'bg-green-100 text-green-700' :
                    pkg.type === 'off-grid' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }>
                    {pkg.type.toUpperCase()}
                  </Badge>
                  {pkg.isFeatured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl md:text-3xl">{pkg.name}</CardTitle>
                <CardDescription className="text-lg">{provider?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Zap className="w-6 h-6 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold">{pkg.systemCapacity}</div>
                    <div className="text-sm text-muted-foreground">kW Capacity</div>
                  </div>
                  {pkg.hardwareQualityScore && (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Star className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                      <div className="text-2xl font-bold">{Number(pkg.hardwareQualityScore).toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Quality Score</div>
                    </div>
                  )}
                  {pkg.roiYears && (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <TrendingUp className="w-6 h-6 mx-auto text-green-600 mb-2" />
                      <div className="text-2xl font-bold">{pkg.roiYears}</div>
                      <div className="text-sm text-muted-foreground">වසර ROI</div>
                    </div>
                  )}
                  {pkg.warrantyYears && (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Shield className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                      <div className="text-2xl font-bold">{pkg.warrantyYears}</div>
                      <div className="text-sm text-muted-foreground">වසර Warranty</div>
                    </div>
                  )}
                </div>

                {pkg.description && (
                  <p className="text-muted-foreground">{pkg.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Hardware Details Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Hardware විස්තර</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="panel">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="panel">Solar Panel</TabsTrigger>
                    <TabsTrigger value="inverter">Inverter</TabsTrigger>
                    <TabsTrigger value="battery" disabled={!battery}>Battery</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="panel" className="mt-4">
                    {panel ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{panel.model}</h4>
                            <p className="text-sm text-muted-foreground">{pkg.panelCount} Panels</p>
                          </div>
                          {panel.qualityScore && (
                            <Badge className={getQualityClass(Number(panel.qualityScore))}>
                              {Number(panel.qualityScore).toFixed(1)}/10
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Wattage:</span>
                            <span className="ml-2 font-medium">{panel.wattage}W</span>
                          </div>
                          {panel.efficiency && (
                            <div>
                              <span className="text-muted-foreground">Efficiency:</span>
                              <span className="ml-2 font-medium">{panel.efficiency}%</span>
                            </div>
                          )}
                          {panel.cellType && (
                            <div>
                              <span className="text-muted-foreground">Cell Type:</span>
                              <span className="ml-2 font-medium">{panel.cellType}</span>
                            </div>
                          )}
                          {panel.warrantyYears && (
                            <div>
                              <span className="text-muted-foreground">Warranty:</span>
                              <span className="ml-2 font-medium">{panel.warrantyYears} years</span>
                            </div>
                          )}
                          {panel.degradationAnnual && (
                            <div>
                              <span className="text-muted-foreground">Annual Degradation:</span>
                              <span className="ml-2 font-medium">{panel.degradationAnnual}%</span>
                            </div>
                          )}
                          {panel.output25Years && (
                            <div>
                              <span className="text-muted-foreground">25-Year Output:</span>
                              <span className="ml-2 font-medium">{panel.output25Years}%</span>
                            </div>
                          )}
                        </div>

                        {(panel.pros || panel.cons) && (
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            {panel.pros && panel.pros.length > 0 && (
                              <div>
                                <h5 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" /> Pros
                                </h5>
                                <ul className="space-y-1 text-sm">
                                  {panel.pros.map((pro, i) => (
                                    <li key={i} className="text-muted-foreground">• {pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {panel.cons && panel.cons.length > 0 && (
                              <div>
                                <h5 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                                  <XCircle className="w-4 h-4" /> Cons
                                </h5>
                                <ul className="space-y-1 text-sm">
                                  {panel.cons.map((con, i) => (
                                    <li key={i} className="text-muted-foreground">• {con}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">Panel විස්තර නොමැත</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="inverter" className="mt-4">
                    {inverter ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{inverter.model}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{inverter.type} Inverter</p>
                          </div>
                          {inverter.qualityScore && (
                            <Badge className={getQualityClass(Number(inverter.qualityScore))}>
                              {Number(inverter.qualityScore).toFixed(1)}/10
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Capacity:</span>
                            <span className="ml-2 font-medium">{inverter.capacity}kW</span>
                          </div>
                          {inverter.efficiency && (
                            <div>
                              <span className="text-muted-foreground">Efficiency:</span>
                              <span className="ml-2 font-medium">{inverter.efficiency}%</span>
                            </div>
                          )}
                          {inverter.mpptTrackers && (
                            <div>
                              <span className="text-muted-foreground">MPPT Trackers:</span>
                              <span className="ml-2 font-medium">{inverter.mpptTrackers}</span>
                            </div>
                          )}
                          {inverter.phases && (
                            <div>
                              <span className="text-muted-foreground">Phase:</span>
                              <span className="ml-2 font-medium capitalize">{inverter.phases}</span>
                            </div>
                          )}
                          {inverter.warrantyYears && (
                            <div>
                              <span className="text-muted-foreground">Warranty:</span>
                              <span className="ml-2 font-medium">{inverter.warrantyYears} years</span>
                            </div>
                          )}
                        </div>

                        {(inverter.pros || inverter.cons) && (
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            {inverter.pros && inverter.pros.length > 0 && (
                              <div>
                                <h5 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" /> Pros
                                </h5>
                                <ul className="space-y-1 text-sm">
                                  {inverter.pros.map((pro, i) => (
                                    <li key={i} className="text-muted-foreground">• {pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {inverter.cons && inverter.cons.length > 0 && (
                              <div>
                                <h5 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                                  <XCircle className="w-4 h-4" /> Cons
                                </h5>
                                <ul className="space-y-1 text-sm">
                                  {inverter.cons.map((con, i) => (
                                    <li key={i} className="text-muted-foreground">• {con}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">Inverter විස්තර නොමැත</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="battery" className="mt-4">
                    {battery ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{battery.model}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{battery.type} Battery</p>
                          </div>
                          {battery.qualityScore && (
                            <Badge className={getQualityClass(Number(battery.qualityScore))}>
                              {Number(battery.qualityScore).toFixed(1)}/10
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Capacity:</span>
                            <span className="ml-2 font-medium">{battery.capacityKwh}kWh</span>
                          </div>
                          {battery.voltage && (
                            <div>
                              <span className="text-muted-foreground">Voltage:</span>
                              <span className="ml-2 font-medium">{battery.voltage}V</span>
                            </div>
                          )}
                          {battery.cycleLife && (
                            <div>
                              <span className="text-muted-foreground">Cycle Life:</span>
                              <span className="ml-2 font-medium">{battery.cycleLife} cycles</span>
                            </div>
                          )}
                          {battery.depthOfDischarge && (
                            <div>
                              <span className="text-muted-foreground">DoD:</span>
                              <span className="ml-2 font-medium">{battery.depthOfDischarge}%</span>
                            </div>
                          )}
                          {battery.warrantyYears && (
                            <div>
                              <span className="text-muted-foreground">Warranty:</span>
                              <span className="ml-2 font-medium">{battery.warrantyYears} years</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        මෙම package එකට Battery ඇතුළත් නොවේ
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Features */}
            {pkg.features && pkg.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>ඇතුළත් වන දේ</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">
                  Rs. {Number(pkg.priceLKR).toLocaleString()}
                </CardTitle>
                <CardDescription>
                  {pkg.installationIncluded ? 'Installation ඇතුළත්' : 'Installation වෙනම'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pkg.financingAvailable && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                      <Info className="w-4 h-4" />
                      Financing Available
                    </div>
                    {pkg.financingDetails && (
                      <p className="text-sm text-blue-600">{pkg.financingDetails}</p>
                    )}
                  </div>
                )}

                <Button className="w-full" size="lg">
                  Quote එකක් ඉල්ලන්න
                </Button>
                
                <Link href="/chat">
                  <Button variant="outline" className="w-full">
                    AI උපදේශක සමඟ කතා කරන්න
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Provider Info */}
            {provider && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="font-semibold text-lg">{provider.name}</div>
                  {provider.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{provider.rating}</span>
                    </div>
                  )}
                  {provider.phone && (
                    <a href={`tel:${provider.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                      <Phone className="w-4 h-4" />
                      {provider.phone}
                    </a>
                  )}
                  {provider.email && (
                    <a href={`mailto:${provider.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                      <Mail className="w-4 h-4" />
                      {provider.email}
                    </a>
                  )}
                  {provider.website && (
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
