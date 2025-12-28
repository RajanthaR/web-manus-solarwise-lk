import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, ThumbsDown, CheckCircle, Calendar, Zap, Receipt } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

interface ReviewCardProps {
  review: {
    id: number;
    userId: number;
    overallRating: number;
    installationRating?: number | null;
    performanceRating?: number | null;
    supportRating?: number | null;
    valueRating?: number | null;
    title: string;
    content: string;
    pros?: string[] | null;
    cons?: string[] | null;
    installationDate?: Date | null;
    systemSize?: string | null;
    monthlyGeneration?: string | null;
    previousBill?: string | null;
    currentBill?: string | null;
    photos?: string[] | null;
    isVerified?: boolean | null;
    helpfulCount?: number | null;
    createdAt: Date;
  };
  userName?: string;
  showDetails?: boolean;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewCard({ review, userName, showDetails = true }: ReviewCardProps) {
  const { isAuthenticated, user } = useAuth();
  const [localHelpful, setLocalHelpful] = useState(review.helpfulCount || 0);
  const [userVoted, setUserVoted] = useState<boolean | null>(null);

  const voteMutation = trpc.reviews.vote.useMutation({
    onSuccess: (_, variables) => {
      if (variables.isHelpful) {
        setLocalHelpful((prev) => prev + 1);
      }
      setUserVoted(variables.isHelpful);
      toast.success("ඔබගේ vote එක record කරන ලදී");
    },
    onError: () => {
      toast.error("Vote කිරීමට අසමත් විය");
    },
  });

  const handleVote = (isHelpful: boolean) => {
    if (!isAuthenticated) {
      toast.error("Vote කිරීමට login වන්න");
      return;
    }
    voteMutation.mutate({ reviewId: review.id, isHelpful });
  };

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{userName || "පරිශීලකයා"}</span>
                {review.isVerified && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <StarRating rating={review.overallRating} />
                <span>•</span>
                <span>{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Title */}
        <h4 className="font-semibold text-lg">{review.title}</h4>

        {/* Content */}
        <p className="text-muted-foreground leading-relaxed">{review.content}</p>

        {/* Detailed Ratings */}
        {showDetails && (review.installationRating || review.performanceRating || review.supportRating || review.valueRating) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y border-border/50">
            {review.installationRating && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Installation</div>
                <StarRating rating={review.installationRating} size="sm" />
              </div>
            )}
            {review.performanceRating && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Performance</div>
                <StarRating rating={review.performanceRating} size="sm" />
              </div>
            )}
            {review.supportRating && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Support</div>
                <StarRating rating={review.supportRating} size="sm" />
              </div>
            )}
            {review.valueRating && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Value</div>
                <StarRating rating={review.valueRating} size="sm" />
              </div>
            )}
          </div>
        )}

        {/* Pros and Cons */}
        {showDetails && (review.pros?.length || review.cons?.length) && (
          <div className="grid md:grid-cols-2 gap-4">
            {review.pros && review.pros.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-green-600 mb-2">✓ හොඳ දේවල්</h5>
                <ul className="space-y-1">
                  {review.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {review.cons && review.cons.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-red-600 mb-2">✗ නරක දේවල්</h5>
                <ul className="space-y-1">
                  {review.cons.map((con, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Installation Details */}
        {showDetails && (review.systemSize || review.monthlyGeneration || review.previousBill || review.currentBill) && (
          <div className="bg-muted/30 rounded-lg p-4">
            <h5 className="text-sm font-medium mb-3">Installation Details</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {review.installationDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Installed</div>
                    <div>{format(new Date(review.installationDate), "MMM yyyy")}</div>
                  </div>
                </div>
              )}
              {review.systemSize && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">System Size</div>
                    <div>{review.systemSize} kW</div>
                  </div>
                </div>
              )}
              {review.monthlyGeneration && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Monthly Generation</div>
                    <div>{review.monthlyGeneration} kWh</div>
                  </div>
                </div>
              )}
              {review.previousBill && review.currentBill && (
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Bill Savings</div>
                    <div className="text-green-600">
                      LKR {(Number(review.previousBill) - Number(review.currentBill)).toLocaleString()}/month
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Photos */}
        {review.photos && review.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {review.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`Review photo ${i + 1}`}
                className="w-24 h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}

        {/* Helpful Votes */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            {localHelpful > 0 && `${localHelpful} ජනයා මෙය ප්‍රයෝජනවත් යැයි සලකයි`}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">මෙය ප්‍රයෝජනවත්ද?</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(true)}
              disabled={voteMutation.isPending || userVoted !== null}
              className={userVoted === true ? "text-green-600" : ""}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(false)}
              disabled={voteMutation.isPending || userVoted !== null}
              className={userVoted === false ? "text-red-600" : ""}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { StarRating };
