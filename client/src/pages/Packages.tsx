import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";
import { Package, Star, TrendingUp, Zap, Filter, Search, ArrowUpDown, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

export default function Packages() {
  const [filters, setFilters] = useState({
    type: undefined as 'on-grid' | 'off-grid' | 'hybrid' | undefined,
    providerId: undefined as number | undefined,
    sortBy: 'quality' as 'roi' | 'quality' | 'price',
    sortOrder: 'desc' as 'asc' | 'desc',
    minCapacity: 0,
    maxCapacity: 20,
    searchQuery: '',
  });

  const { data: packages, isLoading } = trpc.packages.list.useQuery({
    type: filters.type,
    providerId: filters.providerId,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  const { data: providers } = trpc.providers.list.useQuery();

  const filteredPackages = useMemo(() => {
    if (!packages) return [];
    return packages.filter(item => {
      const capacity = Number(item.package.systemCapacity);
      if (capacity < filters.minCapacity || capacity > filters.maxCapacity) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = item.package.name.toLowerCase().includes(query);
        const matchesProvider = item.provider?.name?.toLowerCase().includes(query);
        if (!matchesName && !matchesProvider) return false;
      }
      return true;
    });
  }, [packages, filters.minCapacity, filters.maxCapacity, filters.searchQuery]);

  const clearFilters = () => {
    setFilters({
      type: undefined,
      providerId: undefined,
      sortBy: 'quality',
      sortOrder: 'desc',
      minCapacity: 0,
      maxCapacity: 20,
      searchQuery: '',
    });
  };

  const hasActiveFilters = filters.type || filters.providerId || filters.searchQuery || 
    filters.minCapacity > 0 || filters.maxCapacity < 20;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Solar Packages
          </h1>
          <p className="text-muted-foreground">
            ශ්‍රී ලංකාවේ ප්‍රමුඛ providers ගෙන් packages සංසන්දනය කරන්න
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">සොයන්න</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Package හෝ Provider..."
                      className="pl-9"
                      value={filters.searchQuery}
                      onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">System Type</label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(v) => setFilters(f => ({ ...f, type: v === 'all' ? undefined : v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="සියල්ල" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">සියල්ල</SelectItem>
                      <SelectItem value="on-grid">On-Grid</SelectItem>
                      <SelectItem value="off-grid">Off-Grid</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Provider Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Provider</label>
                  <Select
                    value={filters.providerId?.toString() || 'all'}
                    onValueChange={(v) => setFilters(f => ({ ...f, providerId: v === 'all' ? undefined : parseInt(v) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="සියල්ල" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">සියල්ල</SelectItem>
                      {providers?.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Capacity Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Capacity: {filters.minCapacity} - {filters.maxCapacity} kW
                  </label>
                  <div className="px-2">
                    <Slider
                      value={[filters.minCapacity, filters.maxCapacity]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={([min, max]) => setFilters(f => ({ ...f, minCapacity: min, maxCapacity: max }))}
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onValueChange={(v) => {
                      const [sortBy, sortOrder] = v.split('-') as ['roi' | 'quality' | 'price', 'asc' | 'desc'];
                      setFilters(f => ({ ...f, sortBy, sortOrder }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quality-desc">Quality Score (High → Low)</SelectItem>
                      <SelectItem value="quality-asc">Quality Score (Low → High)</SelectItem>
                      <SelectItem value="roi-asc">ROI (Fastest First)</SelectItem>
                      <SelectItem value="roi-desc">ROI (Slowest First)</SelectItem>
                      <SelectItem value="price-asc">Price (Low → High)</SelectItem>
                      <SelectItem value="price-desc">Price (High → Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Package List */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredPackages.length} packages හමුවිය
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
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
            ) : filteredPackages.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredPackages.map((item) => (
                  <Link key={item.package.id} href={`/packages/${item.package.id}`}>
                    <Card className="card-hover h-full cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={
                            item.package.type === 'on-grid' ? 'default' :
                            item.package.type === 'off-grid' ? 'secondary' : 'outline'
                          } className={
                            item.package.type === 'on-grid' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                            item.package.type === 'off-grid' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                            'bg-purple-100 text-purple-700 hover:bg-purple-100'
                          }>
                            {item.package.type.toUpperCase()}
                          </Badge>
                          {item.package.hardwareQualityScore && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-50">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-semibold text-yellow-700">
                                {Number(item.package.hardwareQualityScore).toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-1">{item.package.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          {item.provider?.name}
                          {item.provider?.rating && (
                            <span className="text-xs text-muted-foreground">
                              ({item.provider.rating}★)
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-2xl font-bold text-primary">
                            Rs. {Number(item.package.priceLKR).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Zap className="w-4 h-4 text-primary" />
                            <span>{item.package.systemCapacity} kW</span>
                          </div>
                          {item.package.roiYears && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span>{item.package.roiYears} වසර ROI</span>
                            </div>
                          )}
                          {item.package.warrantyYears && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Package className="w-4 h-4 text-blue-600" />
                              <span>{item.package.warrantyYears} වසර Warranty</span>
                            </div>
                          )}
                          {item.package.estimatedMonthlyGeneration && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Zap className="w-4 h-4 text-yellow-600" />
                              <span>{item.package.estimatedMonthlyGeneration} kWh/මාසය</span>
                            </div>
                          )}
                        </div>

                        {/* Hardware Info */}
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {item.panel && (
                              <Badge variant="outline" className="text-xs">
                                {item.panel.wattage}W Panel
                              </Badge>
                            )}
                            {item.inverter && (
                              <Badge variant="outline" className="text-xs">
                                {item.inverter.capacity}kW Inverter
                              </Badge>
                            )}
                            {item.battery && (
                              <Badge variant="outline" className="text-xs">
                                {item.battery.capacityKwh}kWh Battery
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Packages හමු නොවීය</h3>
                <p className="text-muted-foreground mb-4">
                  ඔබේ filters වෙනස් කර නැවත උත්සාහ කරන්න
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Filters Clear කරන්න
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
