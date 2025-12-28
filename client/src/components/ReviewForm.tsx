import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Plus, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

interface ReviewFormProps {
  packageId?: number;
  providerId?: number;
  packageName?: string;
  providerName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function StarInput({ 
  value, 
  onChange, 
  label 
}: { 
  value: number; 
  onChange: (v: number) => void; 
  label: string;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 focus:outline-none"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (hover || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewForm({ 
  packageId, 
  providerId, 
  packageName,
  providerName,
  onSuccess, 
  onCancel 
}: ReviewFormProps) {
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();

  // Form state
  const [overallRating, setOverallRating] = useState(0);
  const [installationRating, setInstallationRating] = useState(0);
  const [performanceRating, setPerformanceRating] = useState(0);
  const [supportRating, setSupportRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [systemSize, setSystemSize] = useState("");
  const [monthlyGeneration, setMonthlyGeneration] = useState("");
  const [previousBill, setPreviousBill] = useState("");
  const [currentBill, setCurrentBill] = useState("");

  const createMutation = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("ඔබගේ review එක submit කරන ලදී! Admin approval එකෙන් පසු publish වේ.");
      if (packageId) {
        utils.reviews.byPackage.invalidate({ packageId });
      }
      if (providerId) {
        utils.reviews.byProvider.invalidate({ providerId });
      }
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Review submit කිරීමට අසමත් විය");
    },
  });

  const handleAddPro = () => {
    if (newPro.trim() && pros.length < 5) {
      setPros([...pros, newPro.trim()]);
      setNewPro("");
    }
  };

  const handleAddCon = () => {
    if (newCon.trim() && cons.length < 5) {
      setCons([...cons, newCon.trim()]);
      setNewCon("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (overallRating === 0) {
      toast.error("කරුණාකර overall rating එකක් දෙන්න");
      return;
    }

    if (title.length < 5) {
      toast.error("Title එක අවම වශයෙන් අකුරු 5ක් විය යුතුය");
      return;
    }

    if (content.length < 20) {
      toast.error("Review එක අවම වශයෙන් අකුරු 20ක් විය යුතුය");
      return;
    }

    createMutation.mutate({
      packageId,
      providerId,
      overallRating,
      installationRating: installationRating || undefined,
      performanceRating: performanceRating || undefined,
      supportRating: supportRating || undefined,
      valueRating: valueRating || undefined,
      title,
      content,
      pros: pros.length > 0 ? pros : undefined,
      cons: cons.length > 0 ? cons : undefined,
      systemSize: systemSize || undefined,
      monthlyGeneration: monthlyGeneration || undefined,
      previousBill: previousBill || undefined,
      currentBill: currentBill || undefined,
    });
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">
            Review එකක් ලිවීමට login වන්න
          </p>
          <Button asChild>
            <a href={getLoginUrl()}>Login වන්න</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review එකක් ලියන්න</CardTitle>
        <CardDescription>
          {packageName && `${packageName} සඳහා ඔබගේ අත්දැකීම බෙදාගන්න`}
          {providerName && `${providerName} සමඟ ඔබගේ අත්දැකීම බෙදාගන්න`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating - Required */}
          <div className="space-y-2">
            <StarInput
              value={overallRating}
              onChange={setOverallRating}
              label="Overall Rating *"
            />
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StarInput
              value={installationRating}
              onChange={setInstallationRating}
              label="Installation"
            />
            <StarInput
              value={performanceRating}
              onChange={setPerformanceRating}
              label="Performance"
            />
            <StarInput
              value={supportRating}
              onChange={setSupportRating}
              label="Support"
            />
            <StarInput
              value={valueRating}
              onChange={setValueRating}
              label="Value for Money"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ඔබගේ review එකට title එකක් දෙන්න"
              maxLength={255}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">ඔබගේ Review එක *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="ඔබගේ solar system එක ගැන විස්තරාත්මකව ලියන්න. Installation process, performance, support ගැන ඔබගේ අත්දැකීම..."
              rows={5}
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/5000
            </p>
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label>හොඳ දේවල් (Pros)</Label>
            <div className="flex gap-2">
              <Input
                value={newPro}
                onChange={(e) => setNewPro(e.target.value)}
                placeholder="හොඳ දෙයක් add කරන්න"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPro())}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddPro}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {pros.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {pros.map((pro, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {pro}
                    <button type="button" onClick={() => setPros(pros.filter((_, j) => j !== i))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label>නරක දේවල් (Cons)</Label>
            <div className="flex gap-2">
              <Input
                value={newCon}
                onChange={(e) => setNewCon(e.target.value)}
                placeholder="නරක දෙයක් add කරන්න"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCon())}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddCon}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {cons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {cons.map((con, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {con}
                    <button type="button" onClick={() => setCons(cons.filter((_, j) => j !== i))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Installation Details */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium">Installation Details (Optional)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systemSize">System Size (kW)</Label>
                <Input
                  id="systemSize"
                  type="number"
                  step="0.1"
                  value={systemSize}
                  onChange={(e) => setSystemSize(e.target.value)}
                  placeholder="5.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyGeneration">Monthly Generation (kWh)</Label>
                <Input
                  id="monthlyGeneration"
                  type="number"
                  value={monthlyGeneration}
                  onChange={(e) => setMonthlyGeneration(e.target.value)}
                  placeholder="650"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousBill">Previous Bill (LKR)</Label>
                <Input
                  id="previousBill"
                  type="number"
                  value={previousBill}
                  onChange={(e) => setPreviousBill(e.target.value)}
                  placeholder="25000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentBill">Current Bill (LKR)</Label>
                <Input
                  id="currentBill"
                  type="number"
                  value={currentBill}
                  onChange={(e) => setCurrentBill(e.target.value)}
                  placeholder="2000"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Review Submit කරන්න
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
