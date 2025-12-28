import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Sun, Calculator, Package, Cpu, MessageCircle, ArrowRight, Star, Shield, TrendingUp, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: featuredPackages, isLoading: packagesLoading } = trpc.packages.featured.useQuery();
  const { data: providers } = trpc.providers.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 solar-gradient-light opacity-50" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sun className="w-4 h-4 solar-pulse" />
              <span>ශ්‍රී ලංකාවේ #1 Solar Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              ඔබේ නිවසට හොඳම{" "}
              <span className="text-primary">Solar System</span>{" "}
              එක තෝරන්න
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              ශ්‍රී ලංකාවේ ප්‍රමුඛ Solar Providers ගෙන් packages සංසන්දනය කරන්න. 
              Hardware Quality Score, ROI Calculator සහ AI උපදේශක සමඟ 
              නිවැරදි තීරණය ගන්න.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/packages">
                <Button size="lg" className="gap-2 text-base">
                  <Package className="w-5 h-5" />
                  Packages බලන්න
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/calculator">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <Calculator className="w-5 h-5" />
                  ROI ගණනය කරන්න
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {providers?.length || 10}+
              </div>
              <div className="text-sm text-muted-foreground">Verified Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Solar Packages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.5</div>
              <div className="text-sm text-muted-foreground">වසර ROI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">වසර Warranty</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ඔබට උදව් කරන්නේ කෙසේද?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Solar system එකක් මිලදී ගැනීමට පෙර ඔබ දැනගත යුතු සියල්ල
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover border-2 border-transparent hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Package සංසන්දනය</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  On-grid, Off-grid සහ Hybrid packages සියල්ල එකම තැනකින්. 
                  මිල, Capacity සහ Provider අනුව filter කරන්න.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover border-2 border-transparent hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Hardware Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Global reviews මත පදනම් වූ Panel, Inverter සහ Battery ratings. 
                  Efficiency, Degradation සහ Warranty විස්තර.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover border-2 border-transparent hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">ROI Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  ඔබේ CEB bill එකට ගැලපෙන System Size එක ගණනය කරන්න. 
                  2025 Tariff rates සමඟ නිවැරදි payback period.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover border-2 border-transparent hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">AI උපදේශක</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Electrical Engineer persona සමඟ chat කරන්න. 
                  System sizing, Hardware quality සහ CEB tariffs ගැන ප්‍රශ්න අහන්න.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                ජනප්‍රිය Packages
              </h2>
              <p className="text-muted-foreground">
                ඉහළම Hardware Quality Score ඇති packages
              </p>
            </div>
            <Link href="/packages">
              <Button variant="outline" className="gap-2">
                සියල්ල බලන්න
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {packagesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted rounded w-1/3 mb-4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredPackages && featuredPackages.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPackages.map((item) => (
                <Link key={item.package.id} href={`/packages/${item.package.id}`}>
                  <Card className="card-hover h-full cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.package.type === 'on-grid' ? 'bg-green-100 text-green-700' :
                          item.package.type === 'off-grid' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {item.package.type.toUpperCase()}
                        </span>
                        {item.package.hardwareQualityScore && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">
                              {Number(item.package.hardwareQualityScore).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg">{item.package.name}</CardTitle>
                      <CardDescription>{item.provider?.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-bold text-primary">
                          Rs. {Number(item.package.priceLKR).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          <span>{item.package.systemCapacity} kW</span>
                        </div>
                        {item.package.roiYears && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{item.package.roiYears} වසර ROI</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Featured packages ඉක්මනින් එකතු වේ
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Card className="solar-gradient text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <CardContent className="relative p-8 md:p-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ඔබේ Bill එක අඩු කරගන්න
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  ඔබේ මාසික විදුලි බිල්පත ඇතුළත් කර, ඔබට ගැලපෙන 
                  Solar System එක සොයාගන්න. ROI Calculator භාවිතා කරන්න.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/calculator">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <Calculator className="w-5 h-5" />
                      ROI Calculator
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button size="lg" variant="outline" className="gap-2 bg-transparent border-white text-white hover:bg-white/10">
                      <MessageCircle className="w-5 h-5" />
                      AI උපදේශක සමඟ කතා කරන්න
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg">SolarWise LK</div>
                  <div className="text-xs text-muted-foreground">ශ්‍රී ලංකාව</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                ශ්‍රී ලංකාවේ විශ්වාසනීය Solar Energy Platform
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/packages" className="hover:text-primary">Packages</Link></li>
                <li><Link href="/calculator" className="hover:text-primary">ROI Calculator</Link></li>
                <li><Link href="/hardware" className="hover:text-primary">Hardware Reviews</Link></li>
                <li><Link href="/chat" className="hover:text-primary">AI උපදේශක</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="cursor-default">CEB Tariff Guide</span></li>
                <li><span className="cursor-default">Net Metering Info</span></li>
                <li><span className="cursor-default">Installation Guide</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>info@solarwise.lk</li>
                <li>+94 11 XXX XXXX</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 SolarWise LK. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
