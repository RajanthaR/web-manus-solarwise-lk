import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Building2, Package, Sun, Zap, Battery, Plus, Pencil, Trash2, Shield, Loader2 } from "lucide-react";

export default function Admin() {
  const { tab } = useParams<{ tab?: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const activeTab = tab || "providers";

  // Queries
  const { data: providers, refetch: refetchProviders } = trpc.providers.list.useQuery();
  const { data: packages, refetch: refetchPackages } = trpc.packages.list.useQuery({});
  const { data: panels, refetch: refetchPanels } = trpc.panels.list.useQuery();
  const { data: inverters, refetch: refetchInverters } = trpc.inverters.list.useQuery();
  const { data: batteries, refetch: refetchBatteries } = trpc.batteries.list.useQuery();
  const { data: brands, refetch: refetchBrands } = trpc.brands.list.useQuery();

  // Mutations
  const createProviderMutation = trpc.providers.create.useMutation({
    onSuccess: () => {
      toast.success("Provider created successfully");
      refetchProviders();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const createPackageMutation = trpc.packages.create.useMutation({
    onSuccess: () => {
      toast.success("Package created successfully");
      refetchPackages();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const createBrandMutation = trpc.brands.create.useMutation({
    onSuccess: () => {
      toast.success("Brand created successfully");
      refetchBrands();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const createPanelMutation = trpc.panels.create.useMutation({
    onSuccess: () => {
      toast.success("Panel created successfully");
      refetchPanels();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const createInverterMutation = trpc.inverters.create.useMutation({
    onSuccess: () => {
      toast.success("Inverter created successfully");
      refetchInverters();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const createBatteryMutation = trpc.batteries.create.useMutation({
    onSuccess: () => {
      toast.success("Battery created successfully");
      refetchBatteries();
    },
    onError: (error: any) => toast.error(error.message),
  });

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="sinhala">
                <span className="tech-term">Admin</span> පුවරුව
              </CardTitle>
              <CardDescription className="sinhala">
                ප්‍රවේශය සඳහා පිවිසීම අවශ්‍යයි
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href={getLoginUrl()}>
                <Button className="w-full sinhala">පිවිසෙන්න</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check admin role
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-red-600 sinhala">ප්‍රවේශය ප්‍රතික්ෂේප විය</CardTitle>
              <CardDescription className="sinhala">
                මෙම පිටුවට ප්‍රවේශ වීමට <span className="tech-term">Admin</span> අවසර අවශ්‍යයි
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold sinhala">
              <span className="tech-term">Admin</span> පුවරුව
            </h1>
            <p className="text-gray-600 sinhala">
              <span className="tech-term">Providers</span>, <span className="tech-term">Packages</span>, සහ <span className="tech-term">Hardware</span> කළමනාකරණය
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setLocation(`/admin/${v}`)}>
          <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-6">
            <TabsTrigger value="providers" className="gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Providers</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Packages</span>
            </TabsTrigger>
            <TabsTrigger value="panels" className="gap-2">
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Panels</span>
            </TabsTrigger>
            <TabsTrigger value="inverters" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Inverters</span>
            </TabsTrigger>
            <TabsTrigger value="batteries" className="gap-2">
              <Battery className="w-4 h-4" />
              <span className="hidden sm:inline">Batteries</span>
            </TabsTrigger>
          </TabsList>

          {/* Providers Tab */}
          <TabsContent value="providers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="sinhala">
                    <span className="tech-term">Solar Providers</span>
                  </CardTitle>
                  <CardDescription className="sinhala">
                    ශ්‍රී ලංකාවේ <span className="tech-term">Solar</span> සැපයුම්කරුවන් කළමනාකරණය
                  </CardDescription>
                </div>
                <ProviderDialog onSubmit={(data) => createProviderMutation.mutate(data)} />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers?.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell className="font-medium">{provider.name}</TableCell>
                        <TableCell>{provider.address || "-"}</TableCell>
                        <TableCell>{provider.phone || provider.email || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={provider.isActive ? "default" : "secondary"}>
                            {provider.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!providers || providers.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          No providers yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="sinhala">
                    <span className="tech-term">Solar Packages</span>
                  </CardTitle>
                  <CardDescription className="sinhala">
                    <span className="tech-term">On-grid</span> සහ <span className="tech-term">Off-grid</span> පැකේජ කළමනාකරණය
                  </CardDescription>
                </div>
                <PackageDialog 
                  providers={providers || []} 
                  panels={panels?.map(p => p.panel) || []}
                  inverters={inverters?.map(i => i.inverter) || []}
                  onSubmit={(data) => createPackageMutation.mutate(data)} 
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages?.map((pkg) => (
                      <TableRow key={pkg.package.id}>
                        <TableCell className="font-medium">{pkg.package.name}</TableCell>
                        <TableCell>{pkg.provider?.name || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {pkg.package.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{pkg.package.systemCapacity} kW</TableCell>
                        <TableCell>LKR {pkg.package.priceLKR?.toLocaleString() || "-"}</TableCell>
                      </TableRow>
                    ))}
                    {(!packages || packages.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          No packages yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Panels Tab */}
          <TabsContent value="panels">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="sinhala">
                    <span className="tech-term">Solar Panels</span>
                  </CardTitle>
                  <CardDescription className="sinhala">
                    <span className="tech-term">Panel</span> මාදිලි සහ ශ්‍රේණිගත කිරීම් කළමනාකරණය
                  </CardDescription>
                </div>
                <PanelDialog 
                  brands={brands || []} 
                  onSubmit={(data) => createPanelMutation.mutate(data)} 
                  onCreateBrand={(data) => createBrandMutation.mutate(data)}
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Wattage</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {panels?.map((item) => (
                      <TableRow key={item.panel.id}>
                        <TableCell className="font-medium">{item.panel.model}</TableCell>
                        <TableCell>{item.brand?.name || "-"}</TableCell>
                        <TableCell>{item.panel.wattage}W</TableCell>
                        <TableCell>{item.panel.efficiency}%</TableCell>
                        <TableCell>
                          <Badge className={Number(item.panel.qualityScore) >= 7 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                            {Number(item.panel.qualityScore).toFixed(1)}/10
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!panels || panels.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          No panels yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inverters Tab */}
          <TabsContent value="inverters">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="sinhala">
                    <span className="tech-term">Inverters</span>
                  </CardTitle>
                  <CardDescription className="sinhala">
                    <span className="tech-term">Inverter</span> මාදිලි සහ ශ්‍රේණිගත කිරීම් කළමනාකරණය
                  </CardDescription>
                </div>
                <InverterDialog 
                  brands={brands || []} 
                  onSubmit={(data) => createInverterMutation.mutate(data)} 
                  onCreateBrand={(data) => createBrandMutation.mutate(data)}
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inverters?.map((item) => (
                      <TableRow key={item.inverter.id}>
                        <TableCell className="font-medium">{item.inverter.model}</TableCell>
                        <TableCell>{item.brand?.name || "-"}</TableCell>
                        <TableCell className="capitalize">{item.inverter.type}</TableCell>
                        <TableCell>{item.inverter.capacity} kW</TableCell>
                        <TableCell>
                          <Badge className={Number(item.inverter.qualityScore) >= 7 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                            {Number(item.inverter.qualityScore).toFixed(1)}/10
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!inverters || inverters.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          No inverters yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batteries Tab */}
          <TabsContent value="batteries">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="sinhala">
                    <span className="tech-term">Batteries</span>
                  </CardTitle>
                  <CardDescription className="sinhala">
                    <span className="tech-term">Battery</span> මාදිලි සහ ශ්‍රේණිගත කිරීම් කළමනාකරණය
                  </CardDescription>
                </div>
                <BatteryDialog 
                  brands={brands || []} 
                  onSubmit={(data) => createBatteryMutation.mutate(data)} 
                  onCreateBrand={(data) => createBrandMutation.mutate(data)}
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batteries?.map((item) => (
                      <TableRow key={item.battery.id}>
                        <TableCell className="font-medium">{item.battery.model}</TableCell>
                        <TableCell>{item.brand?.name || "-"}</TableCell>
                        <TableCell className="uppercase">{item.battery.type}</TableCell>
                        <TableCell>{item.battery.capacityKwh} kWh</TableCell>
                        <TableCell>
                          <Badge className={Number(item.battery.qualityScore) >= 7 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                            {Number(item.battery.qualityScore).toFixed(1)}/10
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!batteries || batteries.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          No batteries yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Provider Dialog Component
function ProviderDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    description: "",
  });

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Provider name is required");
      return;
    }
    onSubmit(formData);
    setOpen(false);
    setFormData({ name: "", location: "", phone: "", email: "", website: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Provider
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Provider</DialogTitle>
          <DialogDescription>Add a new solar provider to the database</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Provider</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Package Dialog Component
function PackageDialog({ providers, panels, inverters, onSubmit }: { providers: any[]; panels: any[]; inverters: any[]; onSubmit: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    providerId: "",
    systemType: "on-grid",
    capacityKw: "",
    priceLkr: "",
    panelId: "",
    inverterId: "",
    warrantyYears: "10",
    description: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.capacityKw) {
      toast.error("Name and capacity are required");
      return;
    }
    onSubmit({
      ...formData,
      providerId: formData.providerId ? Number(formData.providerId) : undefined,
      capacityKw: Number(formData.capacityKw),
      priceLkr: formData.priceLkr ? Number(formData.priceLkr) : undefined,
      panelId: formData.panelId ? Number(formData.panelId) : undefined,
      inverterId: formData.inverterId ? Number(formData.inverterId) : undefined,
      warrantyYears: Number(formData.warrantyYears),
    });
    setOpen(false);
    setFormData({ name: "", providerId: "", systemType: "on-grid", capacityKw: "", priceLkr: "", panelId: "", inverterId: "", warrantyYears: "10", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Package
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Package</DialogTitle>
          <DialogDescription>Add a new solar package to the database</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label>Package Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={formData.providerId} onValueChange={(v) => setFormData({ ...formData, providerId: v })}>
                <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>System Type *</Label>
              <Select value={formData.systemType} onValueChange={(v) => setFormData({ ...formData, systemType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-grid">On-Grid</SelectItem>
                  <SelectItem value="off-grid">Off-Grid</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Capacity (kW) *</Label>
              <Input type="number" value={formData.capacityKw} onChange={(e) => setFormData({ ...formData, capacityKw: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Price (LKR)</Label>
              <Input type="number" value={formData.priceLkr} onChange={(e) => setFormData({ ...formData, priceLkr: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Panel</Label>
              <Select value={formData.panelId} onValueChange={(v) => setFormData({ ...formData, panelId: v })}>
                <SelectTrigger><SelectValue placeholder="Select panel" /></SelectTrigger>
                <SelectContent>
                  {panels.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Inverter</Label>
              <Select value={formData.inverterId} onValueChange={(v) => setFormData({ ...formData, inverterId: v })}>
                <SelectTrigger><SelectValue placeholder="Select inverter" /></SelectTrigger>
                <SelectContent>
                  {inverters.map((i) => (
                    <SelectItem key={i.id} value={String(i.id)}>{i.model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Warranty (Years)</Label>
            <Input type="number" value={formData.warrantyYears} onChange={(e) => setFormData({ ...formData, warrantyYears: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Package</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Panel Dialog Component
function PanelDialog({ brands, onSubmit, onCreateBrand }: { brands: any[]; onSubmit: (data: any) => void; onCreateBrand: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    brandId: "",
    wattage: "",
    efficiency: "",
    cellType: "",
    warrantyYears: "25",
    degradationAnnual: "0.5",
    qualityScore: "7",
    pros: "",
    cons: "",
  });

  const handleSubmit = () => {
    if (!formData.model || !formData.wattage) {
      toast.error("Model and wattage are required");
      return;
    }
    onSubmit({
      ...formData,
      brandId: formData.brandId ? Number(formData.brandId) : undefined,
      wattage: Number(formData.wattage),
      efficiency: formData.efficiency ? Number(formData.efficiency) : undefined,
      warrantyYears: Number(formData.warrantyYears),
      degradationAnnual: Number(formData.degradationAnnual),
      qualityScore: Number(formData.qualityScore),
      pros: formData.pros ? formData.pros.split(",").map(s => s.trim()) : [],
      cons: formData.cons ? formData.cons.split(",").map(s => s.trim()) : [],
    });
    setOpen(false);
    setFormData({ model: "", brandId: "", wattage: "", efficiency: "", cellType: "", warrantyYears: "25", degradationAnnual: "0.5", qualityScore: "7", pros: "", cons: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Panel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Panel</DialogTitle>
          <DialogDescription>Add a new solar panel model to the database</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Model *</Label>
              <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select value={formData.brandId} onValueChange={(v) => setFormData({ ...formData, brandId: v })}>
                <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Wattage (W) *</Label>
              <Input type="number" value={formData.wattage} onChange={(e) => setFormData({ ...formData, wattage: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Efficiency (%)</Label>
              <Input type="number" step="0.1" value={formData.efficiency} onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cell Type</Label>
              <Input value={formData.cellType} onChange={(e) => setFormData({ ...formData, cellType: e.target.value })} placeholder="Mono PERC" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Warranty (Years)</Label>
              <Input type="number" value={formData.warrantyYears} onChange={(e) => setFormData({ ...formData, warrantyYears: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Degradation (%/yr)</Label>
              <Input type="number" step="0.1" value={formData.degradationAnnual} onChange={(e) => setFormData({ ...formData, degradationAnnual: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Quality Score</Label>
              <Input type="number" step="0.1" min="0" max="10" value={formData.qualityScore} onChange={(e) => setFormData({ ...formData, qualityScore: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Pros (comma-separated)</Label>
            <Input value={formData.pros} onChange={(e) => setFormData({ ...formData, pros: e.target.value })} placeholder="High efficiency, Good warranty" />
          </div>
          <div className="space-y-2">
            <Label>Cons (comma-separated)</Label>
            <Input value={formData.cons} onChange={(e) => setFormData({ ...formData, cons: e.target.value })} placeholder="Higher price, Heavy" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Panel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Inverter Dialog Component
function InverterDialog({ brands, onSubmit, onCreateBrand }: { brands: any[]; onSubmit: (data: any) => void; onCreateBrand: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    brandId: "",
    type: "hybrid",
    capacity: "",
    efficiency: "",
    mpptTrackers: "",
    warrantyYears: "10",
    qualityScore: "7",
    pros: "",
    cons: "",
  });

  const handleSubmit = () => {
    if (!formData.model || !formData.capacity) {
      toast.error("Model and capacity are required");
      return;
    }
    onSubmit({
      ...formData,
      brandId: formData.brandId ? Number(formData.brandId) : undefined,
      capacity: Number(formData.capacity),
      efficiency: formData.efficiency ? Number(formData.efficiency) : undefined,
      mpptTrackers: formData.mpptTrackers ? Number(formData.mpptTrackers) : undefined,
      warrantyYears: Number(formData.warrantyYears),
      qualityScore: Number(formData.qualityScore),
      pros: formData.pros ? formData.pros.split(",").map(s => s.trim()) : [],
      cons: formData.cons ? formData.cons.split(",").map(s => s.trim()) : [],
    });
    setOpen(false);
    setFormData({ model: "", brandId: "", type: "hybrid", capacity: "", efficiency: "", mpptTrackers: "", warrantyYears: "10", qualityScore: "7", pros: "", cons: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Inverter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Inverter</DialogTitle>
          <DialogDescription>Add a new inverter model to the database</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Model *</Label>
              <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select value={formData.brandId} onValueChange={(v) => setFormData({ ...formData, brandId: v })}>
                <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="micro">Micro</SelectItem>
                  <SelectItem value="off-grid">Off-Grid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Capacity (kW) *</Label>
              <Input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Efficiency (%)</Label>
              <Input type="number" step="0.1" value={formData.efficiency} onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>MPPT Trackers</Label>
              <Input type="number" value={formData.mpptTrackers} onChange={(e) => setFormData({ ...formData, mpptTrackers: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Warranty (Years)</Label>
              <Input type="number" value={formData.warrantyYears} onChange={(e) => setFormData({ ...formData, warrantyYears: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Quality Score</Label>
              <Input type="number" step="0.1" min="0" max="10" value={formData.qualityScore} onChange={(e) => setFormData({ ...formData, qualityScore: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Pros (comma-separated)</Label>
            <Input value={formData.pros} onChange={(e) => setFormData({ ...formData, pros: e.target.value })} placeholder="Good value, WiFi monitoring" />
          </div>
          <div className="space-y-2">
            <Label>Cons (comma-separated)</Label>
            <Input value={formData.cons} onChange={(e) => setFormData({ ...formData, cons: e.target.value })} placeholder="Fan noise, Basic app" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Inverter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Battery Dialog Component
function BatteryDialog({ brands, onSubmit, onCreateBrand }: { brands: any[]; onSubmit: (data: any) => void; onCreateBrand: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    brandId: "",
    type: "lithium",
    capacityKwh: "",
    cycleLife: "",
    warrantyYears: "10",
    qualityScore: "7",
    pros: "",
    cons: "",
  });

  const handleSubmit = () => {
    if (!formData.model || !formData.capacityKwh) {
      toast.error("Model and capacity are required");
      return;
    }
    onSubmit({
      ...formData,
      brandId: formData.brandId ? Number(formData.brandId) : undefined,
      capacityKwh: Number(formData.capacityKwh),
      cycleLife: formData.cycleLife ? Number(formData.cycleLife) : undefined,
      warrantyYears: Number(formData.warrantyYears),
      qualityScore: Number(formData.qualityScore),
      pros: formData.pros ? formData.pros.split(",").map(s => s.trim()) : [],
      cons: formData.cons ? formData.cons.split(",").map(s => s.trim()) : [],
    });
    setOpen(false);
    setFormData({ model: "", brandId: "", type: "lithium", capacityKwh: "", cycleLife: "", warrantyYears: "10", qualityScore: "7", pros: "", cons: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Battery
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Battery</DialogTitle>
          <DialogDescription>Add a new battery model to the database</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Model *</Label>
              <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select value={formData.brandId} onValueChange={(v) => setFormData({ ...formData, brandId: v })}>
                <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lithium">Lithium</SelectItem>
                  <SelectItem value="lfp">LFP</SelectItem>
                  <SelectItem value="lead-acid">Lead Acid</SelectItem>
                  <SelectItem value="gel">Gel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Capacity (kWh) *</Label>
              <Input type="number" step="0.1" value={formData.capacityKwh} onChange={(e) => setFormData({ ...formData, capacityKwh: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cycle Life</Label>
              <Input type="number" value={formData.cycleLife} onChange={(e) => setFormData({ ...formData, cycleLife: e.target.value })} placeholder="6000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Warranty (Years)</Label>
              <Input type="number" value={formData.warrantyYears} onChange={(e) => setFormData({ ...formData, warrantyYears: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Quality Score</Label>
              <Input type="number" step="0.1" min="0" max="10" value={formData.qualityScore} onChange={(e) => setFormData({ ...formData, qualityScore: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Pros (comma-separated)</Label>
            <Input value={formData.pros} onChange={(e) => setFormData({ ...formData, pros: e.target.value })} placeholder="Long cycle life, Safe chemistry" />
          </div>
          <div className="space-y-2">
            <Label>Cons (comma-separated)</Label>
            <Input value={formData.cons} onChange={(e) => setFormData({ ...formData, cons: e.target.value })} placeholder="Higher cost, Heavy" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Battery</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
